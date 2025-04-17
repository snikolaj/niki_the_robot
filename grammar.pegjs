// Niki Pascal Grammar for Peggy.js

{
  // Helper function to create statement blocks
  function makeBlock(stmts) {
    return { type: "block", statements: stmts || [] };
  }
}

start
  = _ program:program _ { return program; }

program
  = "program" __ name:identifier _ ";" _ decls:declarations main:compound_statement "." _
  { return { type: "program", name: name.name, declarations: decls, main: main }; }

declarations
  = procs:(procedure_declaration*) { return procs; }

procedure_declaration
  = "procedure" __ name:identifier _ ";" _ body:compound_statement ";" _
  { return { type: "procedureDeclaration", name: name.name, body: body }; }

compound_statement
  = "begin" _ statements:statement_sequence _ "end"
  { return makeBlock(statements); }

// The key change: handling statement sequence with proper termination
statement_sequence
  = first:statement rest:(statement_terminator statement)* statement_terminator? {
      const statements = [first];
      rest.forEach(item => statements.push(item[1]));
      return statements;
    }
  / "" { return []; } // Allow empty blocks

// Semicolon is the statement terminator
statement_terminator
  = _ ";" _

statement
  = procedure_call
  / if_statement
  / repeat_statement
  / compound_statement

procedure_call
  = name:identifier { return { type: "procedureCall", name: name.name }; }

if_statement
  = "if" __ condition:expression __ "then" _ then_branch:statement else_part:else_part? {
      return {
        type: "ifStatement",
        condition: condition,
        thenBranch: then_branch,
        elseBranch: else_part
      };
    }

else_part
  = _ "else" _ statement:statement { return statement; }

repeat_statement
  = "repeat" _ body:statement_sequence _ "until" __ condition:expression
  { return { type: "repeatStatement", body: makeBlock(body), condition: condition }; }

expression
  = negated_expression
  / identifier

negated_expression
  = "not" __ expr:expression { return { type: "negatedExpression", expression: expr }; }

// --- Lexical Elements ---

// Allow built-in Niki functions and user-defined procedure names
identifier "identifier"
  = !keyword name:$( [a-zA-Z_][a-zA-Z0-9_]* ) { return { type: "identifier", name: name }; }

// Keywords that cannot be identifiers
keyword
  = ("program" / "procedure" / "begin" / "end" / "if" / "then" / "else" / "repeat" / "until" / "not") ![a-zA-Z0-9_]

// Whitespace and Comments
_ "whitespace"
  = (whitespace / comment)*

__ "mandatory whitespace"
  = (whitespace / comment)+

whitespace = [ \t\r\n]+
comment = "{" [^}]* "}"
