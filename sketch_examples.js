// --- Example Code Snippets ---

const EXAMPLE_CODE = [
    {
        category: "Basic Movement",
        title: "Move Forward",
        description: "Moves Niki one step forward if the path is clear.",
        code: `program move_forward_example;
begin
    { Attempt to move Niki one step in the current direction }
    vor
end.`
    },
    {
        category: "Basic Movement",
        title: "Turn Right (Procedure)",
        description: "Defines and uses a procedure to make Niki turn right.",
        code: `program turn_right_example;

{ Define a new command 'turn_right' by turning left three times }
procedure turn_right;
begin
    drehe_links;
    drehe_links;
    drehe_links
end;

begin
    { Execute the newly defined procedure }
    turn_right
end.`
    },
    {
        category: "Basic Movement",
        title: "Turn Around",
        description: "Uses a procedure to make Niki turn 180 degrees.",
        code: `program turn_around_example;

procedure turn_around;
begin
    drehe_links;
    drehe_links
end;

begin
    turn_around
end.`
    },
    {
        category: "Conditional Logic",
        title: "If Wall, Turn Left",
        description: "Checks if there's a wall ahead. If so, Niki turns left, otherwise moves forward.",
        code: `program if_wall_turn;
begin
    { Check the condition 'not vorne_frei' which means 'is there a wall in front?' }
    if not vorne_frei then
    begin
        { If wall exists, turn left }
        drehe_links
    end
    else
    begin
        { If no wall, move forward }
        vor
    end
end.`
    },
    {
        category: "Conditional Logic",
        title: "Check Direction",
        description: "Turns Niki until facing North.",
        code: `program face_north;
begin
    { Repeat turning left as long as Niki is not facing North }
    while not nordwaerts do
    begin
        drehe_links
    end
end.`
    },
    {
        category: "Loops",
        title: "Move Until Wall (Repeat)",
        description: "Niki moves forward repeatedly until a wall is encountered.",
        code: `program move_until_wall_repeat;
begin
    { Start a loop that executes the body at least once }
    repeat
        { Move forward }
        vor
    { Continue looping UNTIL the condition 'not vorne_frei' (wall ahead) becomes true }
    until not vorne_frei
end.`
    },
    {
        category: "Loops",
        title: "Move While Clear (While)",
        description: "Niki moves forward as long as the path ahead is clear.",
        code: `program move_while_clear_while;
begin
    { Start a loop that only executes if the condition is initially true }
    while vorne_frei do
    begin
        { Move forward as long as 'vorne_frei' is true }
        vor
    end
end.`
    },
    {
        category: "Balls",
        title: "Pick Up a Ball",
        description: "Niki picks up a ball if one is present on the current square.",
        code: `program pickup_if_present;
begin
    { Check if the current square has a ball }
    if platz_belegt then
    begin
        { If yes, pick it up }
        nimm_auf
    end
end.`
    },
    {
        category: "Balls",
        title: "Drop a Ball",
        description: "Niki drops a ball on the current square if holding any.",
        code: `program drop_if_holding;
begin
    { Check if Niki is carrying at least one ball }
    if hat_Vorrat then
    begin
        { If yes, drop one ball }
        gib_ab
    end
end.`
    },
    {
        category: "Balls",
        title: "Pick Up All Balls on Spot",
        description: "Niki picks up all balls from the current square.",
        code: `program pickup_all_on_spot;
begin
    { While there is a ball on the current spot }
    while platz_belegt do
    begin
        { Pick it up }
        nimm_auf
    end
end.`
    },
    {
        category: "Combined",
        title: "Clear Forward Line of Balls",
        description: "Niki moves forward, picking up any ball found on each square, until a wall is hit.",
        code: `program clear_forward_line;
begin
    { Repeat moving and checking for balls }
    repeat
        { Check if there's a ball on the current square }
        if platz_belegt then
        begin
            { If yes, pick it up (runtime error if Niki has no space - advanced examples could check hat_Vorrat) }
            nimm_auf
        end;
        { Move forward if possible }
        if vorne_frei then
        begin
            vor
        end
    { Stop when Niki cannot move forward anymore (is at a wall) }
    until not vorne_frei;

    { Final check for a ball on the square where Niki stopped }
    if platz_belegt then
    begin
        nimm_auf
    end
end.`
    },
    {
        category: "Combined",
        title: "Drop Ball Pattern",
        description: "Moves, drops a ball, moves back. Requires Niki to have balls.",
        code: `program drop_pattern;

procedure turn_around;
begin
    drehe_links;
    drehe_links
end;

begin
    { Ensure Niki has a ball before starting }
    if hat_Vorrat then
    begin
        vor;      { Move one step }
        gib_ab;   { Drop the ball }
        turn_around;
        vor;      { Move back to original spot }
        turn_around; { Face original direction }
    end
end.`
    }
    // Add more complex examples or variations as needed
]; 