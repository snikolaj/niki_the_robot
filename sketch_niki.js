// --- Niki Specific Logic ---

function isColliding() {
    // Check canvas boundaries first (Niki's current position)
    if ( nikiCol < 0 || nikiCol >= ARR_COLS || nikiRow < 0 || nikiRow >= ARR_ROWS) {
       console.warn("isColliding called while Niki is out of bounds");
       return true;
    }

    // Determine the immediate wall to check based on direction
    let wallExists = false;

    switch (nikiDirection % 4) {
        case 0: // North
             wallExists = (nikiRow === 0 || grid[nikiCol][nikiRow].topWall);
             break;
        case 1: // East
             wallExists = (nikiCol === ARR_COLS - 1 || grid[nikiCol][nikiRow].rightWall);
             break;
        case 2: // South
             wallExists = (nikiRow === ARR_ROWS - 1 || grid[nikiCol][nikiRow].bottomWall);
             break;
        case 3: // West
             wallExists = (nikiCol === 0 || grid[nikiCol][nikiRow].leftWall);
             break;
    }

    return wallExists;
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
                 isGridSaved = false;
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
                 isGridSaved = false;
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
    hat_vorrat: () => nikiNumOfBalls > 0,
    nordwaerts: () => nikiDirection % 4 === 0,
    ostwaerts: () => nikiDirection % 4 === 1,
    suedwaerts: () => nikiDirection % 4 === 2,
    westwaerts: () => nikiDirection % 4 === 3
};

function drawNiki() {
    let img;
    // Assign the correct image based on direction
    switch (nikiDirection % 4) {
        case 0: img = nikiUp; break;    // North
        case 1: img = nikiRight; break; // East
        case 2: img = nikiDown; break;   // South
        case 3: img = nikiLeft; break;  // West
    }

    // Check if Niki is within the grid bounds before drawing anything
    if (nikiCol >= 0 && nikiCol < ARR_COLS && nikiRow >= 0 && nikiRow < ARR_ROWS) {

        // 1. Attempt to draw the Niki image if it exists and is loaded
        if (img) {
            image(img, nikiCol * RECT_WIDTH, nikiRow * RECT_HEIGHT, RECT_WIDTH, RECT_HEIGHT);
        } else {
            // Log a warning if an image is missing for the current direction
            console.warn(`Niki image for direction ${nikiDirection % 4} is missing or invalid.`);
            // Optional: Draw a placeholder if image is missing
            fill(128); // Gray placeholder
            noStroke();
            rect(nikiCol * RECT_WIDTH, nikiRow * RECT_HEIGHT, RECT_WIDTH, RECT_HEIGHT);
            stroke(0); // Reset stroke
        }
    }
} 