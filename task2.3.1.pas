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

end.
