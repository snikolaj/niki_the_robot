// --- Code Parsing and Interpretation ---

function loadAndCompileGrammar() {
     fetch('grammar.pegjs')
        .then(response => response.text())
        .then(grammar => {
            try {
                parser = peggy.generate(grammar);
                logOutput("Parser loaded and compiled successfully.");
            } catch (e) {
                 console.error("Error compiling grammar:", e);
                 logError(`Parser compilation failed: ${e.message}. Check console.`);
                 parser = null; // Ensure parser is unusable
            }
        })
        .catch(error => {
            console.error("Error fetching grammar:", error);
            logError("Failed to load parser grammar file (grammar.pegjs). Check console/network tab.");
             parser = null; // Ensure parser is unusable
        });
}

// Helper function to pause execution based on the slider
async function pauseExecution() {
    // Calculate delay in milliseconds. Handle potential division by zero or very high speeds.
    const delayMs = commandsPerSecond > 0 ? Math.max(0, 1000 / commandsPerSecond) : 1000; // Max 1 sec delay if cps is 0
    if (delayMs > 5) { // Only pause if the delay is noticeable to avoid overhead
       await delay(delayMs);
    }
     // Check if execution was cancelled (e.g., by Reset button)
     if (!isExecuting) {
        throw new Error("Execution cancelled by reset."); // Stop execution
     }
}

// Make runCode async to handle await
async function runCode() {
    // logOutput("runCode started."); // REMOVED
    if (!parser) {
        logError("Parser not ready or failed to load. Cannot run code.");
        return;
    }
    // Prevent starting a new run if one is already active
    if (isExecuting) {
        logOutput("Execution already in progress.");
        return;
    }

    isExecuting = true;
    runButtonElement.disabled = true; // Disable button during run
    runButtonElement.textContent = "Running...";
    clearError();
    logOutput("Parsing code...");

    try {
        const code = document.getElementById('code-editor').value;
        const ast = parser.parse(code);
        logOutput("Parsing successful. Executing...");
        procedures = {}; // Reset user-defined procedures

        // First pass: Register procedures
        if (ast.declarations && ast.declarations.length > 0) {
            ast.declarations.forEach(decl => {
                if (decl.type === 'procedureDeclaration') {
                    const procNameLower = decl.name.toLowerCase(); // Convert to lowercase for key
                    const originalName = decl.name; // Keep original name for errors/logging
                    if (NIKI_FUNCTIONS[procNameLower]) throw new Error(`Cannot redefine built-in function: ${originalName}`);
                    if (procedures[procNameLower]) throw new Error(`Procedure already defined: ${originalName}`);
                    procedures[procNameLower] = decl.body; // Store with lowercase key
                    logOutput(`Registered procedure: ${originalName}`); // Log original name
                }
            });
        }

        // Second pass: Execute the main program block asynchronously
        await executeASTNode(ast.main); // Await completion
        logOutput("Execution finished.");

    } catch (e) {
        // Handle parsing, runtime, or cancellation errors
        if (e.message !== "Execution cancelled by reset.") { // Don't log cancellation as an error
            let errorMessage = `Error: ${e.message}`;
            // Check if the error has location info (from parser) before adding it
            if (e.location && e.location.start) {
                errorMessage += `\n  at line ${e.location.start.line}, column ${e.location.start.column}`;
            }
            logError(errorMessage);
            console.error("Execution/Parsing Error:", e);
        } else {
             logOutput("Execution stopped by reset.");
        }
    } finally {
        // This block runs whether execution succeeded, failed, or was cancelled
        isExecuting = false;
        runButtonElement.disabled = false; // Re-enable button
        runButtonElement.textContent = "Run Code";
         logOutput("Execution ended or was stopped.");
        // logOutput("runCode finished."); // REMOVED
    }
}

// --- AST Interpreter ---
// Make executeASTNode async
async function executeASTNode(node) {
    if (!isExecuting || !node) return; // Stop if cancelled or node is null

    switch (node.type) {
        case 'block':
            // Use for...of for async iteration compatibility
            for (const stmt of node.statements) {
                 if (!isExecuting) break; // Check cancellation before each statement
                await executeASTNode(stmt); // Await each statement in the block
            }
            break;

        case 'procedureCall':
            const originalProcName = node.name; // Keep original case for logging/errors
            const procNameLower = originalProcName.toLowerCase(); // Use lowercase for lookup
            if (NIKI_FUNCTIONS[procNameLower]) {
                // Log the actual called name (could be different case)
                logOutput(`Executing built-in: ${originalProcName}`);
                NIKI_FUNCTIONS[procNameLower](); // Built-in functions are quick state changes
                await pauseExecution();     // Pause AFTER the built-in command executes
            } else if (procedures[procNameLower]) {
                logOutput(`Executing user procedure: ${originalProcName}`);
                await executeASTNode(procedures[procNameLower]); // Await the procedure's execution
                // No extra pause needed here, pauses happen inside the procedure's statements
            } else {
                throw new Error(`Undefined procedure called: ${originalProcName}`);
            }
            break;

        case 'ifStatement':
            logOutput(`Evaluating IF condition (${node.condition.name || 'complex'})...`); // Log original case if simple identifier
            const conditionMet = evaluateExpression(node.condition); // Evaluation is synchronous
            logOutput(`IF Condition result: ${conditionMet}`);
            if (conditionMet) {
                logOutput("Executing THEN branch.");
                await executeASTNode(node.thenBranch); // Await the branch
            } else if (node.elseBranch) {
                logOutput("Executing ELSE branch.");
                await executeASTNode(node.elseBranch); // Await the branch
            } else {
                logOutput("IF condition FALSE, no ELSE branch.");
                 // await pauseExecution(); // Decided against pausing here for now
            }
            break;

        case 'repeatStatement':
            let loopCountRepeat = 0;
            const maxLoopsRepeat = 1000;
            const conditionNameRepeat = node.condition.name || 'complex'; // Get original name/complex indicator
            logOutput(`Entering REPEAT loop (until ${conditionNameRepeat})...`);
            do {
                 if (!isExecuting) break;
                await executeASTNode(node.body);
                loopCountRepeat++;
                if (loopCountRepeat > maxLoopsRepeat) throw new Error(`Max loop iterations (${maxLoopsRepeat}) exceeded in REPEAT.`);

                 if (!isExecuting) break;
                const untilConditionMet = evaluateExpression(node.condition); // Evaluate using potentially mixed-case name internally
                logOutput(`Loop condition check (iteration ${loopCountRepeat}): UNTIL ${conditionNameRepeat} is ${untilConditionMet}`);
                 if (untilConditionMet) break;

                 await pauseExecution();
            } while (true);
             if (isExecuting) { // Log exit only if not cancelled
                logOutput(`Exiting REPEAT loop (condition ${conditionNameRepeat} became TRUE).`);
             }
            break;

        case 'whileStatement':
            let loopCountWhile = 0;
            const maxLoopsWhile = 1000;
            const conditionNameWhile = node.condition.name || 'complex'; // Get original name/complex indicator
            logOutput(`Entering WHILE loop (while ${conditionNameWhile})...`);
            while (isExecuting && evaluateExpression(node.condition)) { // Condition checked first
                logOutput(`WHILE condition ${conditionNameWhile} is TRUE. Executing body (iteration ${loopCountWhile + 1}).`);
                await executeASTNode(node.body);
                loopCountWhile++;
                if (loopCountWhile > maxLoopsWhile) throw new Error(`Max loop iterations (${maxLoopsWhile}) exceeded in WHILE.`);

                 if (!isExecuting) break;

                await pauseExecution();
            }
             if (isExecuting) { // Log exit reason only if not cancelled
                logOutput(`Exiting WHILE loop (condition ${conditionNameWhile} became FALSE).`);
             }
            break;

        default:
            console.warn(`Interpreter encountered unhandled AST node type: ${node.type}`);
    }
}

function evaluateExpression(node) {
    switch (node.type) {
        case 'identifier':
            const originalFuncName = node.name; // Keep original case for errors
            const funcNameLower = originalFuncName.toLowerCase(); // Use lowercase for lookup

            // Check if it's a Niki condition function
            if (NIKI_FUNCTIONS[funcNameLower] && typeof NIKI_FUNCTIONS[funcNameLower] === 'function') {
                // Check arity or type if necessary - here assume conditions take no args and return boolean
                // We might want to add a check later to ensure it *is* a condition function
                const result = NIKI_FUNCTIONS[funcNameLower]();
                // logOutput(`Evaluated condition '${originalFuncName}': ${result}`); // Verbose log with original name
                return result;
            } else {
                 // Check if it's a defined procedure (which cannot be used as a condition)
                 if (procedures[funcNameLower]){
                     throw new Error(`Procedure '${originalFuncName}' cannot be used as a condition.`);
                 } else {
                     // Otherwise, it's an undefined identifier used as a condition
                     throw new Error(`Cannot evaluate identifier as condition: '${originalFuncName}'. Is it a defined Niki condition function?`);
                 }
            }

        case 'negatedExpression':
            // Evaluate the inner expression and return the opposite boolean value
            const innerResult = evaluateExpression(node.expression);
            // logOutput(`Evaluated NOT expression: !(${node.expression?.name || 'complex'}) -> !${innerResult} -> ${!innerResult}`); // Verbose
            return !innerResult;

        default:
            // Handle unexpected node types in an expression context
            throw new Error(`Cannot evaluate expression node type: ${node.type}`);
    }
} 