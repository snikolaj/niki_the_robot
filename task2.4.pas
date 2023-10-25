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

procedure pick_all_up;
begin
    while platz_belegt do
    begin
        pick_up;
    end;
end;



begin
    mv;
    turn_left;
    
    repeat
        mv;
        pick_all_up;
        turn_left;
        if not vorne_frei then
        begin
           turn_right;
        end;
     until not vorne_frei 
    
    
end.
