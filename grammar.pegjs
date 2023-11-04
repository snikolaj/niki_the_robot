start
  = stmts:functionDeclaration* { return stmts; }

functionDeclaration
  = "function" __ name:word _ "(" _ ")" _ "{" _ body:statements _ "}" _
  { return { type: 'functionDeclaration', name, body }; }

statements
  = stmts:(functionCall / ifStatement / doWhileStatement / whileStatement)* { return stmts; }

ifStatement
  = _ "if" _ "(" _ condition:expression _ ")" _ "{" _ body:statements _ "}" 
  { return { type: 'ifStatement', condition, body }; }

doWhileStatement
  = _ "do" _ "{" _ body:statements _ "}" _ "while" _ "(" _ condition:expression _ ")" _ ";"

whileStatement
  = _ "while" _ "(" _ condition:expression _ ")" _ "{" _ body:statements _ "}" 
  { return { type: "whileStatement", condition, body }; }

expression
  = negatedIdentifier / identifier

word
  = !identifier chars:[a-zA-Z0-9]+ { return { type: "word", wordName: chars.join('') } }

negatedIdentifier
  = "not" __ ident:identifier { return { type: "negatedExpression", ident } }

functionCall
  = name:word _ "(" _ ")" _ ";" { return { type: 'functionCall', name }; }

identifier
  = chars:("nordwaerts" / "ostwaerts" / "suedwaerts" / "ostwaerts" / 
  "vorne_frei" / "links_frei" / "rechts_frei" /
  "platz_belegt" / "hat_Vorrat") { return { type: "identifier", identifier:chars } }

// optional whitespace
_  = [ \t\r\n]*

// mandatory whitespace
__ = [ \t\r\n]+
