// --- Grid Logic ---

class GridSquare {
    constructor(numOfBalls = 0, topWall = false, rightWall = false, bottomWall = false, leftWall = false) {
        this.numOfBalls = numOfBalls;
        this.topWall = topWall;
        this.rightWall = rightWall;
        this.bottomWall = bottomWall;
        this.leftWall = leftWall;
    }
}

function createGrid() {
    grid = new Array(ARR_COLS);
    for (let i = 0; i < ARR_COLS; i++) {
        grid[i] = new Array(ARR_ROWS);
        for (let j = 0; j < ARR_ROWS; j++) {
            grid[i][j] = new GridSquare();
        }
    }
    // Add some default balls/walls for testing
    grid[1][1].numOfBalls = 3;
    grid[3][3].topWall = true;
    grid[3][2].bottomWall = true;
     logOutput("Grid created.");
}

// Draws grid background rectangles and walls
function drawGridBase() {
    strokeWeight(1);
    stroke(0); // Black lines for grid rectangles

    for (let i = 0; i < ARR_COLS; i++) {
        for (let j = 0; j < ARR_ROWS; j++) {
            // Draw the background rectangle
            fill(255); // White square
            rect(i * RECT_WIDTH, j * RECT_HEIGHT, RECT_WIDTH, RECT_HEIGHT);

            // Draw walls
            stroke(255, 0, 0); // Red walls
            strokeWeight(3);
            if (grid[i][j].topWall) {
                line(i * RECT_WIDTH, j * RECT_HEIGHT, (i + 1) * RECT_WIDTH, j * RECT_HEIGHT);
            }
            if (grid[i][j].bottomWall) {
                line(i * RECT_WIDTH, (j + 1) * RECT_HEIGHT, (i + 1) * RECT_WIDTH, (j + 1) * RECT_HEIGHT);
            }
            if (grid[i][j].leftWall) {
                line(i * RECT_WIDTH, j * RECT_HEIGHT, i * RECT_WIDTH, (j + 1) * RECT_HEIGHT);
            }
            if (grid[i][j].rightWall) {
                line((i + 1) * RECT_WIDTH, j * RECT_HEIGHT, (i + 1) * RECT_WIDTH, (j + 1) * RECT_HEIGHT);
            }
            // Reset stroke for next iteration's rectangle border
             strokeWeight(1);
             stroke(0);
        }
    }
}

// Draws items on the grid (balls) that should appear over Niki
function drawGridItems() {
     for (let i = 0; i < ARR_COLS; i++) {
        for (let j = 0; j < ARR_ROWS; j++) {
             // Draw balls
            if (grid[i][j].numOfBalls > 0) {
                fill(0, 0, 255); // Blue balls
                noStroke();
                const ballSize = 6;
                const padding = 4;
                const maxBallsPerRow = Math.floor((RECT_WIDTH - 2 * padding) / (ballSize + padding));

                for(let n = 0; n < grid[i][j].numOfBalls; n++){
                    const ballCol = n % maxBallsPerRow;
                    const ballRow = Math.floor(n / maxBallsPerRow);
                    const x = i * RECT_WIDTH + padding + ballCol * (ballSize + padding) + ballSize/2;
                    const y = j * RECT_HEIGHT + padding + ballRow * (ballSize + padding) + ballSize/2;
                    circle(x, y, ballSize);
                }
                 stroke(0); // Reset stroke just in case
            }
        }
    }
} 