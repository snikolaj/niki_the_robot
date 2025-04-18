function nikiPascalToJS(inputPS){
    var parsedString = inputPS.replace(/ +(?= )/g,'');
  var functionNames = [];

    var rules = [[" not ", "!"],
                [";", "\n"],
                [" ", "\n"],
                [".", ""],
                ["{", "/*"],
                ["}", "*/"],
                ["if", "if("],
                ["then", "){"],
                ["begin", "{"],
                ["end", "}"],
                ["do", ")"],
                ["repeat", "do {"],
                ["while", "} while("],
                ["until", "while("],
                ["procedure", "function "],
                ["program", ""]

            ];
                
    for(let i = 0; i < rules.length; i++){
        parsedString = parsedString.replaceAll(rules[i][0], rules[i][1]);
    }
  
  parsedString = parsedString.replace(/[\r\n]{2,}/g, "\n");
  parsedString = parsedString.split("\n").slice(2).join("\n");
  parsedString = parsedString.split("\n");
  for(let i = 0; i < parsedString.length; i++){
    if(parsedString[i] === "function"){
      functionNames.push(parsedString[i + 1]);
      parsedString[i + 1] += "()";
    }
    if(parsedString[i].includes("while(")){
      parsedString[i] += ")";
    }
  }
  
  parsedString = parsedString.join("\n");

  for(let i = 0; i < functionNames.length; i++){
    parsedString = parsedString.replaceAll(functionNames[i], functionNames[i] + "();");
  }
  
  return parsedString;
    // use replaceAll
}


function setup() {
  createCanvas(400, 400);
  var testStr = `



program test;

procedure turn_right;
begin
    drehe_links;
    drehe_links;
    drehe_links;
end;

procedure turn_left;
begin
    drehe_links;
end;

procedure turn_180;
begin
    turn_left;
    turn_left;
end;

procedure mv;
begin
    vor;
end;

procedure drop;
begin
    gib_ab;
end;

procedure pick_up;
begin
    nimm_auf;
end;

procedure mv_while_free;
begin
    repeat
        mv;
    until not vorne_frei;
end;

procedure one_ball;
begin
    turn_left;
    mv;
    drop;
    turn_180;
    mv;
    turn_left;
end;

procedure two_balls;
begin
    pick_up;
    turn_right;
    mv;
    drop; drop;
    turn_180;
    mv;
    turn_right;
end;

begin
    turn_left;
    mv;
    turn_right;
    mv;mv;
    
    repeat
        mv;
        pick_up;
        if platz_belegt then
        begin
            two_balls;
        end
        else
        begin
            one_ball;
        end;
    until not vorne_frei;

end.`;
  
  console.log(nikiPascalToJS(testStr));
}

function draw() {
  background(220);
}
