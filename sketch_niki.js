// --- Niki Specific Logic ---

function isColliding() {
    // Check canvas boundaries first
    if ( nikiCol < 0 || nikiCol >= ARR_COLS || nikiRow < 0 || nikiRow >= ARR_ROWS) {
       return true; // Implicit wall at boundary
    }

     // Check current square based on direction before moving
     let targetCol = nikiCol;
     let targetRow = nikiRow;
     let checkCurrentWall = false; // Should we check the wall of the current square?
     let checkTargetWall = false; // Should we check the wall of the square Niki is facing?
     let wallToCheck = null; // Which wall property to check

     switch (nikiDirection % 4) {
        case 0: // North
            targetRow--;
            wallToCheck = 'topWall';
            checkCurrentWall = true;
            if (targetRow >= 0) wallToCheck = 'bottomWall'; checkTargetWall = true; // Check wall of cell above
            break;
        case 1: // East
            targetCol++;
            wallToCheck = 'rightWall';
            checkCurrentWall = true;
            if (targetCol < ARR_COLS) wallToCheck = 'leftWall'; checkTargetWall = true; // Check wall of cell to the right
             break;
        case 2: // South
            targetRow++;
            wallToCheck = 'bottomWall';
            checkCurrentWall = true;
            if (targetRow < ARR_ROWS) wallToCheck = 'topWall'; checkTargetWall = true; // Check wall of cell below
             break;
        case 3: // West
            targetCol--;
            wallToCheck = 'leftWall';
            checkCurrentWall = true;
             if (targetCol >= 0) wallToCheck = 'rightWall'; checkTargetWall = true; // Check wall of cell to the left
             break;
    }

     // Check boundary collision
     if (targetRow < 0 || targetRow >= ARR_ROWS || targetCol < 0 || targetCol >= ARR_COLS) {
        return true;
    }

    // Check wall collision
     if (checkCurrentWall && grid[nikiCol][nikiRow][wallToCheck]) {
        return true;
    }
     // Check the wall of the target square (if applicable and exists)
    // Note: This logic assumes walls are two-sided (setting a right wall also sets the neighbor's left wall)
    // The check above is sufficient if walls are correctly placed by the builder.

    return false; // No collision detected
}


// --- Niki Built-in Functions (Pascal Names) ---
const NIKI_FUNCTIONS = {
    drehe_links: () => { nikiDirection--; logOutput("Niki turned left."); },
    vor: () => {
        if (!isColliding()) {
            switch (nikiDirection % 4) {
                case 0: nikiRow--; break; // North
                case 1: nikiCol++; break; // East
                case 2: nikiRow++; break; // South
                case 3: nikiCol--; break; // West
            }
            logOutput("Niki moved forward.");
        } else {
            throw new Error("Niki crashed into a wall!");
        }
    },
    gib_ab: () => {
        if (nikiNumOfBalls > 0) {
             if (nikiCol >= 0 && nikiCol < ARR_COLS && nikiRow >= 0 && nikiRow < ARR_ROWS) {
                 grid[nikiCol][nikiRow].numOfBalls++;
                 nikiNumOfBalls--;
                 updateBallCounterDisplay();
                 logOutput("Niki dropped a ball.");
             } else {
                 throw new Error("Niki is outside the grid!"); // Should ideally not happen
             }
        } else {
            throw new Error("Niki has no balls to drop!");
        }
    },
    nimm_auf: () => {
         if (nikiCol >= 0 && nikiCol < ARR_COLS && nikiRow >= 0 && nikiRow < ARR_ROWS) {
            if (grid[nikiCol][nikiRow].numOfBalls > 0) {
                 grid[nikiCol][nikiRow].numOfBalls--;
                 nikiNumOfBalls++;
                 updateBallCounterDisplay();
                 logOutput("Niki picked up a ball.");
            } else {
                 throw new Error("No ball to pick up here!");
            }
         } else {
             throw new Error("Niki is outside the grid!"); // Should ideally not happen
         }
    },
    // Condition Functions (return boolean)
    vorne_frei: () => !isColliding(),
    platz_belegt: () => {
        if (nikiCol >= 0 && nikiCol < ARR_COLS && nikiRow >= 0 && nikiRow < ARR_ROWS) {
            return grid[nikiCol][nikiRow].numOfBalls > 0;
        }
        return false; // Outside grid is not 'belegt'
    },
    hat_Vorrat: () => nikiNumOfBalls > 0,
    nordwaerts: () => nikiDirection % 4 === 0,
    ostwaerts: () => nikiDirection % 4 === 1,
    suedwaerts: () => nikiDirection % 4 === 2,
    westwaerts: () => nikiDirection % 4 === 3
};

function drawNiki() {
    let img;
    switch (nikiDirection % 4) {
        case 0: img = nikiUp; break;
        case 1: img = nikiRight; break;
        case 2: img = nikiDown; break;
        case 3: img = nikiLeft; break;
    }
     if (img && nikiCol >= 0 && nikiCol < ARR_COLS && nikiRow >= 0 && nikiRow < ARR_ROWS) {
        image(img, nikiCol * RECT_WIDTH, nikiRow * RECT_HEIGHT, RECT_WIDTH, RECT_HEIGHT);

        // Draw ball count ON Niki
        fill(0);
        noStroke(); // Ensure text isn't stroked
        textSize(10);
        textAlign(CENTER, CENTER);
        text(nikiNumOfBalls, nikiCol * RECT_WIDTH + RECT_WIDTH / 2, nikiRow * RECT_HEIGHT + RECT_HEIGHT / 2);
         stroke(0); // Reset stroke
    }
} 