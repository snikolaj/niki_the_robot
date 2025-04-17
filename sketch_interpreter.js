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


function runCode() {
    if (!parser) {
        logError("Parser not ready or failed to load. Cannot run code.");
        return;
    }

    const code = document.getElementById('code-editor').value;
    clearError(); // Clear previous errors
    logOutput("Parsing code...");

    try {
        const ast = parser.parse(code);
        logOutput("Parsing successful. Executing...");
        procedures = {}; // Reset user-defined procedures

        // First pass: Register procedures defined in the code
        if (ast.declarations && ast.declarations.length > 0) {
            ast.declarations.forEach(decl => {
                if (decl.type === 'procedureDeclaration') {
                    if (NIKI_FUNCTIONS[decl.name]) {
                         throw new Error(`Cannot redefine built-in function: ${decl.name}`);
                    }
                    if (procedures[decl.name]) {
                         throw new Error(`Procedure already defined: ${decl.name}`);
                    }
                    procedures[decl.name] = decl.body; // Store the AST node representing the procedure body
                     logOutput(`Registered procedure: ${decl.name}`);
                }
            });
        }

        // Second pass: Execute the main program block
        executeASTNode(ast.main);
        logOutput("Execution finished.");

    } catch (e) {
        // Handle both parsing and runtime errors
        let errorMessage = `Error: ${e.message}`;
        if (e.location) { // Add location info if it's a parse error
             errorMessage += `\n  at line ${e.location.start.line}, column ${e.location.start.column}`;
        }
        logError(errorMessage);
        console.error("Execution/Parsing Error:", e); // Log full error object
    }
}

// --- AST Interpreter ---
function executeASTNode(node) {
    if (!node) return; // Handle cases like missing else branches

    switch (node.type) {
        case 'block':
            // Execute each statement in the block sequentially
            node.statements.forEach(stmt => executeASTNode(stmt));
            break;

        case 'procedureCall':
            const procName = node.name;
            if (NIKI_FUNCTIONS[procName]) {
                // Execute a built-in Niki function
                NIKI_FUNCTIONS[procName]();
            } else if (procedures[procName]) {
                // Execute a user-defined procedure by executing its stored AST body
                 logOutput(`Executing user procedure: ${procName}`);
                executeASTNode(procedures[procName]);
            } else {
                throw new Error(`Undefined procedure called: ${procName}`);
            }
            break;

        case 'ifStatement':
             logOutput("Evaluating IF condition...");
            const conditionMet = evaluateExpression(node.condition);
             logOutput(`IF Condition (${node.condition.name || 'complex'}): ${conditionMet}`);
            if (conditionMet) {
                 logOutput("Executing THEN branch.");
                executeASTNode(node.thenBranch);
            } else if (node.elseBranch) {
                 logOutput("Executing ELSE branch.");
                executeASTNode(node.elseBranch);
            } else {
                 logOutput("IF condition FALSE, no ELSE branch.");
            }
            break;

        case 'repeatStatement':
            let loopCount = 0;
            const maxLoops = 1000; // Safety break for infinite loops
             logOutput("Entering REPEAT loop...");
            do {
                executeASTNode(node.body); // Execute the loop body
                loopCount++;
                if (loopCount > maxLoops) {
                    throw new Error(`Maximum loop iterations (${maxLoops}) exceeded in REPEAT statement. Possible infinite loop.`);
                }
                 // Evaluate the UNTIL condition AFTER executing the body
                 const untilConditionMet = evaluateExpression(node.condition);
                 logOutput(`Loop condition check (iteration ${loopCount}): UNTIL ${node.condition.name || 'complex'} is ${untilConditionMet}`);
                 if (untilConditionMet) {
                    break; // Exit loop if condition is true
                 }
            } while (true); // Condition checked inside the loop
             logOutput("Exiting REPEAT loop.");
            break;

        default:
            // This case handles node types like 'program' or 'procedureDeclaration'
            // which don't have direct execution logic here (handled elsewhere)
            console.warn(`Interpreter encountered unhandled AST node type during execution: ${node.type}`);
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