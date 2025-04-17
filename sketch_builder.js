// --- Builder Mode Logic ---

function handleBuilderModeToggle(e) {
     builderMode = e.target.checked;
     logOutput(`Builder Mode ${builderMode ? 'Enabled' : 'Disabled'}`);
}

function builderMousePressed() {
    if (!builderMode || mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height) {
        return; // Only operate within canvas and in builder mode
    }

    const col = Math.floor(mouseX / RECT_WIDTH);
    const row = Math.floor(mouseY / RECT_HEIGHT);

    if (col < 0 || col >= ARR_COLS || row < 0 || row >= ARR_ROWS) return;

    const xInRect = mouseX % RECT_WIDTH;
    const yInRect = mouseY % RECT_HEIGHT;
    const borderZone = RECT_WIDTH / 4;

    let wallInteracted = false;

    // Top wall
    if (yInRect < borderZone && row > 0) {
        if (mouseButton === LEFT) {
            grid[col][row].topWall = !grid[col][row].topWall;
            grid[col][row - 1].bottomWall = grid[col][row].topWall;
        } else if (mouseButton === RIGHT) {
            grid[col][row].topWall = false;
            grid[col][row - 1].bottomWall = false;
        }
        wallInteracted = true;
        logOutput(`Wall interaction at top edge of (${col}, ${row})`);
    }
    // Bottom wall
    else if (yInRect > RECT_HEIGHT - borderZone && row < ARR_ROWS - 1) {
        if (mouseButton === LEFT) {
            grid[col][row].bottomWall = !grid[col][row].bottomWall;
            grid[col][row + 1].topWall = grid[col][row].bottomWall;
        } else if (mouseButton === RIGHT) {
            grid[col][row].bottomWall = false;
            grid[col][row + 1].topWall = false;
        }
        wallInteracted = true;
         logOutput(`Wall interaction at bottom edge of (${col}, ${row})`);
    }
    // Left wall
    else if (xInRect < borderZone && col > 0) {
        if (mouseButton === LEFT) {
            grid[col][row].leftWall = !grid[col][row].leftWall;
            grid[col - 1][row].rightWall = grid[col][row].leftWall;
        } else if (mouseButton === RIGHT) {
            grid[col][row].leftWall = false;
            grid[col - 1][row].rightWall = false;
        }
        wallInteracted = true;
         logOutput(`Wall interaction at left edge of (${col}, ${row})`);
    }
    // Right wall
    else if (xInRect > RECT_WIDTH - borderZone && col < ARR_COLS - 1) {
        if (mouseButton === LEFT) {
            grid[col][row].rightWall = !grid[col][row].rightWall;
            grid[col + 1][row].leftWall = grid[col][row].rightWall;
        } else if (mouseButton === RIGHT) {
            grid[col][row].rightWall = false;
            grid[col + 1][row].leftWall = false;
        }
        wallInteracted = true;
         logOutput(`Wall interaction at right edge of (${col}, ${row})`);
    }

    // Ball interaction (center clicks)
    if (!wallInteracted) {
        if (mouseButton === LEFT) {
            grid[col][row].numOfBalls++;
            logOutput(`Added ball at (${col}, ${row}). Total: ${grid[col][row].numOfBalls}`);
        } else if (mouseButton === RIGHT) {
            if (grid[col][row].numOfBalls > 0) {
                grid[col][row].numOfBalls--;
                logOutput(`Removed ball at (${col}, ${row}). Total: ${grid[col][row].numOfBalls}`);
            }
        }
    }
}

function builderMouseClicked() {
     if (!builderMode || mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height) {
        return;
    }
     const col = Math.floor(mouseX / RECT_WIDTH);
    const row = Math.floor(mouseY / RECT_HEIGHT);
     if (col < 0 || col >= ARR_COLS || row < 0 || row >= ARR_ROWS) return;

    // Middle click to place Niki
    if (mouseButton === CENTER) {
         nikiCol = col;
         nikiRow = row;
         logOutput(`Niki placed at (${col}, ${row})`);
    }
} 