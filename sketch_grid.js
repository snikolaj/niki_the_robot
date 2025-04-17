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
     const numBallsPerRow = 3; // Target number of balls per row
     const ballSize = 6;      // Diameter of each ball

     for (let i = 0; i < ARR_COLS; i++) {
        for (let j = 0; j < ARR_ROWS; j++) {
             const totalBallsInSquare = grid[i][j].numOfBalls;
            if (totalBallsInSquare > 0) {
                fill(0, 0, 255); // Blue balls
                noStroke();

                // --- Calculate Spacing ---

                // Horizontal spacing: Calculate the gap needed between balls and edges
                // Total space occupied by balls = numBallsPerRow * ballSize
                // Total space available for gaps = RECT_WIDTH - (numBallsPerRow * ballSize)
                // Number of gaps = numBallsPerRow + 1 (edges + between balls)
                const gapSizeX = (RECT_WIDTH - numBallsPerRow * ballSize) / (numBallsPerRow + 1);

                // Calculate number of rows needed based on total balls and balls per row
                const numRowsOfBalls = Math.ceil(totalBallsInSquare / numBallsPerRow);

                // Vertical spacing: Calculate similarly using the number of rows
                const gapSizeY = (RECT_HEIGHT - numRowsOfBalls * ballSize) / (numRowsOfBalls + 1);

                // --- Draw Balls ---
                for(let n = 0; n < totalBallsInSquare; n++){
                    const ballCol = n % numBallsPerRow; // Column index (0, 1, or 2)
                    const ballRow = Math.floor(n / numBallsPerRow); // Row index (0, 1, ...)

                    // Calculate center X: start of square + initial gap + (ball index * (ball + gap)) + half ball size
                    const centerX = (i * RECT_WIDTH) + gapSizeX + ballCol * (ballSize + gapSizeX) + (ballSize / 2);

                    // Calculate center Y: similarly for vertical position
                    const centerY = (j * RECT_HEIGHT) + gapSizeY + ballRow * (ballSize + gapSizeY) + (ballSize / 2);

                    circle(centerX, centerY, ballSize); // Draw the ball centered
                }
                 stroke(0); // Reset stroke just in case
            }
        }
    }
} 