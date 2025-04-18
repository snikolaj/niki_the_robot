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
  = "program"i __ name:identifier _ ";" _ decls:declarations main:compound_statement "." _
  { return { type: "program", name: name.name, declarations: decls, main: main }; }

declarations
  = procs:(procedure_declaration*) { return procs; }

procedure_declaration
  = "procedure"i __ name:identifier _ ";" _ body:compound_statement ";" _
  { return { type: "procedureDeclaration", name: name.name, body: body }; }

compound_statement
  = "begin"i _ statements:statement_sequence _ "end"i
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
  / while_statement
  / compound_statement

procedure_call
  = name:identifier { return { type: "procedureCall", name: name.name }; }

if_statement
  = "if"i __ condition:expression __ "then"i _ then_branch:statement else_part:else_part? {
      return {
        type: "ifStatement",
        condition: condition,
        thenBranch: then_branch,
        elseBranch: else_part
      };
    }

else_part
  = _ "else"i _ statement:statement { return statement; }

repeat_statement
  = "repeat"i _ body:statement_sequence _ "until"i __ condition:expression
  { return { type: "repeatStatement", body: makeBlock(body), condition: condition }; }

while_statement
  = "while"i __ condition:expression __ "do"i _ body:statement
  { return { type: "whileStatement", condition: condition, body: body }; }

expression
  = negated_expression
  / identifier

negated_expression
  = "not"i __ expr:expression { return { type: "negatedExpression", expression: expr }; }

// --- Lexical Elements ---

// Allow built-in Niki functions and user-defined procedure names
identifier "identifier"
  = !keyword name:$( [a-zA-Z_][a-zA-Z0-9_]* ) { return { type: "identifier", name: name }; }

// Keywords that cannot be identifiers
keyword
  = ("program"i / "procedure"i / "begin"i / "end"i / "if"i / "then"i / "else"i / "repeat"i / "until"i / "not"i / "while"i / "do"i) ![a-zA-Z0-9_]

// Whitespace and Comments
_ "whitespace"
  = (whitespace / comment)*

__ "mandatory whitespace"
  = (whitespace / comment)+

whitespace = [ \t\r\n]+
comment = "{" [^}]* "}"
