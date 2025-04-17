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
                    if (NIKI_FUNCTIONS[decl.name]) throw new Error(`Cannot redefine built-in function: ${decl.name}`);
                    if (procedures[decl.name]) throw new Error(`Procedure already defined: ${decl.name}`);
                    procedures[decl.name] = decl.body;
                    logOutput(`Registered procedure: ${decl.name}`);
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
            if (e.location) { // Add location info for parse errors
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
         logOutput("Execution ended or was stopped."); // Log end state
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
            const procName = node.name;
            if (NIKI_FUNCTIONS[procName]) {
                NIKI_FUNCTIONS[procName](); // Built-in functions are quick state changes
                await pauseExecution();     // Pause AFTER the built-in command executes
            } else if (procedures[procName]) {
                logOutput(`Executing user procedure: ${procName}`);
                await executeASTNode(procedures[procName]); // Await the procedure's execution
                // No extra pause needed here, pauses happen inside the procedure's statements
            } else {
                throw new Error(`Undefined procedure called: ${procName}`);
            }
            break;

        case 'ifStatement':
            logOutput("Evaluating IF condition...");
            const conditionMet = evaluateExpression(node.condition); // Evaluation is synchronous
            logOutput(`IF Condition (${node.condition.name || 'complex'}): ${conditionMet}`);
            if (conditionMet) {
                logOutput("Executing THEN branch.");
                await executeASTNode(node.thenBranch); // Await the branch
            } else if (node.elseBranch) {
                logOutput("Executing ELSE branch.");
                await executeASTNode(node.elseBranch); // Await the branch
            } else {
                logOutput("IF condition FALSE, no ELSE branch.");
                 await pauseExecution(); // Pause even if no branch taken? Optional. For now, no.
            }
            break;

        case 'repeatStatement':
            let loopCount = 0;
            const maxLoops = 1000;
            logOutput("Entering REPEAT loop...");
            do {
                 if (!isExecuting) break; // Check cancellation at start of loop
                await executeASTNode(node.body); // Await the loop body's execution
                loopCount++;
                if (loopCount > maxLoops) throw new Error(`Max loop iterations (${maxLoops}) exceeded.`);

                 if (!isExecuting) break; // Check cancellation before condition eval
                const untilConditionMet = evaluateExpression(node.condition); // Condition eval is sync
                logOutput(`Loop condition check (iteration ${loopCount}): UNTIL ${node.condition.name || 'complex'} is ${untilConditionMet}`);
                 if (untilConditionMet) break; // Exit loop if condition is true

                 await pauseExecution(); // Pause at the end of each loop iteration AFTER check
            } while (true);
            logOutput("Exiting REPEAT loop.");
            break;

        default:
            console.warn(`Interpreter encountered unhandled AST node type: ${node.type}`);
    }
}

function evaluateExpression(node) {
    switch (node.type) {
        case 'identifier':
            // Assume identifiers in expressions are calls to Niki's condition functions
            const funcName = node.name;
            if (NIKI_FUNCTIONS[funcName] && typeof NIKI_FUNCTIONS[funcName] === 'function') {
                const result = NIKI_FUNCTIONS[funcName]();
                 // logOutput(`Evaluated condition '${funcName}': ${result}`); // Can be verbose, uncomment if needed
                return result;
            } else {
                 // Check if it's a variable or undefined function
                 if (procedures[funcName]){
                     throw new Error(`Procedure '${funcName}' cannot be used as a condition.`);
                 } else {
                     throw new Error(`Cannot evaluate identifier as condition: ${funcName}. Is it a defined Niki condition function?`);
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