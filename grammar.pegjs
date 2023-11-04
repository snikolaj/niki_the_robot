// start by matching only functions - this is where everything starts
// don't care about whether a function is main or not, that's for the step following
start
  = stmts:functionDeclaration* { return stmts; }

// in C-style syntax, if-statements, function declarations, while/do-while statements all look very similar
functionDeclaration
  = _ "function" __ name:word _ "(" _ ")" _ "{" _ body:statements _ "}" _
  { return { type: "functionDeclaration", name, body }; }

// will be matched sequentially, so if-else shouldn't ever be interpreted as if
statements
  = stmts:(ifElseStatement / ifStatement / doWhileStatement / whileStatement / functionCall)* { return stmts; }

ifStatement
  = _ "if" _ "(" _ condition:expression _ ")" _ "{" _ body:statements _ "}" 
  { return { type: "ifStatement", condition, body }; }

ifElseStatement
  = _ "if" _ "(" _ condition:expression _ ")" _ "{" _ body:statements _ "}" 
  _ "else" _ "{" _ elseStatement:statements _ "}"
  { return { type: "ifElseStatement", condition, body, elseStatement }; }

doWhileStatement
  = _ "do" _ "{" _ body:statements _ "}" _ "while" _ "(" _ condition:expression _ ")" _ ";"
  { return { type: "doWhileStatement", condition, body }; }

whileStatement
  = _ "while" _ "(" _ condition:expression _ ")" _ "{" _ body:statements _ "}" 
  { return { type: "whileStatement", condition, body }; }

// for now only allow the keyword "not" to denote a negation of an identifier
// TODO: find proper terminology
expression
  = negatedIdentifier / identifier

// match all words with numbers and underscores that aren't expressions or reserved names
// at the end of reserved names, make sure they aren't beginnings of other words
// so that statements like if_there_is_ball do not get falsely misinterpreted
word
  = !(expression ![a-zA-Z0-9_] / reserved_names ![a-zA-Z0-9_]) chars:[a-zA-Z0-9_]+ { return chars.join('') }

negatedIdentifier
  = _ "not" __ ident:identifier { return { type: "negatedExpression", ident } }
  
functionCall
  = _ name:word _ "(" _ ")" _ ";" { return { type: 'functionCall', name }; }

// original German identifiers, later add English
identifier
  = chars:("nordwaerts" / "ostwaerts" / "suedwaerts" / "ostwaerts" / 
  "vorne_frei" / "links_frei" / "rechts_frei" /
  "platz_belegt" / "hat_Vorrat") { return { type: "identifier", identifier:chars } }

// these should never be function names
reserved_names
  = "function" / "if" / "do" / "for" / "while" / "else"

// optional whitespace
_  = [ \t\r\n]*

// mandatory whitespace
__ = [ \t\r\n]+

// note to self - don't forget to include optional whitespace before statements, or they will not work
