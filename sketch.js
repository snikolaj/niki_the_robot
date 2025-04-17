// --- p5.js Sketch and Niki Logic ---

// Playfield dimensions
const ARR_ROWS = 10;
const ARR_COLS = 15;
const RECT_WIDTH = 32;
const RECT_HEIGHT = 32;

// Niki state
let grid;
let nikiCol = 0;
let nikiRow = 0;
// Direction: 0=N, 1=E, 2=S, 3=W
let nikiDirection = (1 << 30); // Start facing North (large num % 4 == 0)
let nikiNumOfBalls = 0;
let builderMode = true; // Default builder mode

// Niki images
let nikiUp, nikiLeft, nikiDown, nikiRight;

// Parser and AST
let parser;
let procedures = {}; // To store user-defined procedures

// --- Grid Square Class ---
class GridSquare {
    constructor(numOfBalls = 0, topWall = false, rightWall = false, bottomWall = false, leftWall = false) {
        this.numOfBalls = numOfBalls;
        this.topWall = topWall;
        this.rightWall = rightWall;
        this.bottomWall = bottomWall;
        this.leftWall = leftWall;
    }
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
            grid[nikiCol][nikiRow].numOfBalls++;
            nikiNumOfBalls--;
            logOutput("Niki dropped a ball.");
        } else {
            throw new Error("Niki has no balls to drop!");
        }
    },
    nimm_auf: () => {
        if (grid[nikiCol][nikiRow].numOfBalls > 0) {
            grid[nikiCol][nikiRow].numOfBalls--;
            nikiNumOfBalls++;
            logOutput("Niki picked up a ball.");
        } else {
            throw new Error("No ball to pick up here!");
        }
    },
    // Condition Functions (return boolean)
    vorne_frei: () => !isColliding(),
    platz_belegt: () => grid[nikiCol][nikiRow].numOfBalls > 0,
    hat_Vorrat: () => nikiNumOfBalls > 0,
    nordwaerts: () => nikiDirection % 4 === 0,
    ostwaerts: () => nikiDirection % 4 === 1,
    suedwaerts: () => nikiDirection % 4 === 2,
    westwaerts: () => nikiDirection % 4 === 3 // Corrected typo from suedwaerts
};

function isColliding() {
    if ( nikiCol < 0 || nikiCol >= ARR_COLS || nikiRow < 0 || nikiRow >= ARR_ROWS) {
       return true; // Colliding with canvas boundary
    }
    switch (nikiDirection % 4) {
        case 0: return nikiRow === 0 || grid[nikiCol][nikiRow].topWall;       // North
        case 1: return nikiCol === ARR_COLS - 1 || grid[nikiCol][nikiRow].rightWall; // East
        case 2: return nikiRow === ARR_ROWS - 1 || grid[nikiCol][nikiRow].bottomWall; // South
        case 3: return nikiCol === 0 || grid[nikiCol][nikiRow].leftWall;     // West
    }
    return false; // Should not happen
}


// --- p5.js Setup ---
function preload() {
    // Load Niki images (same base64 as before)
    nikiUp = loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABEZJREFUWEfNl19sk2UUxn/v+7W0Hc45NtzWsYGIG0OJCTFqzIJ/IjJGcToMjguGUYwIFyhzirvRGyImbpKgMUIMu3ARMRlT/hpNjBocRFgihjAmizITYAKbyGi7rt97zPe5wTBubccInoumTc573qfnOed5vk9xg0Pd4PsZE4DsQFDyI6c5lZbH2fCpMdUY+uNjOmzbIjn+ArpjXVhKj6nGtQEQI1lpQXounULr6wwgM5AryoBSYFDoQejG/Tb0CaJAK0NPuDuljoya7Mu9V7LnV0F/hAOf1CFw1dA4v4dHdkz4Mqp4MsOBm1yMmDjRmyGTquroRzNv6WNcKJmNeGwMHreywUZhISIuKC2GNLHo8xgO3VHAuUhywzkigJs8GZK5tI44ioefKWdbdci9bLQQ8bLw4HEOFo8DAKcDActHXGme2P0NjdULsQys+P4o3731Ae17Nrl9eH3/EU70Rvlq1Uv0/n6Q8h86aC0uoDd6OikaRkzKyCySVevfZPPaGha17KXxuRCQxtR5z3Ji61q8+cUoDLcvWs0v79diLMGaUkRZazuHiwqIobgQTUzDiADSM2bI7LkLOPb1p1Tu+paPli8APEx59EVOblmDNW06ShR3la/mpw9rUWoAVTCTstYO2ooKiOLjr+hvCbswYsKkQFCUGIyCis/20biyEkRjicHWBpzhc0fin91wltJG8/iBDvYXFXL+WimY6M2U7Ko3iOg46Wc6mbNpI80PzkbEpvpAO914XG3YV1oCAwPubIYOdTAQ1/xYEuRc5BpnwCmYt6xBbKXxdx7GTJuFEcsdPGcV9eBCGB1HGw+KuEtR+PMGelPwh4Qc/dfaZUzIEaUddVT0Rs6MqUbSXpDjzXe7gHIUQVzGnSievwStoX3vdndOnIF05DhZ7pMGEKyud2hnoLme0p87sbXHHT6NwUIRE1Ba8BjBaEPL9LSUOpIwObj8bTG2Jty8kYeOHOOLGTdfPjPZlytn+69QUNYVk32FExLWHE5rwuT86g1iG4vIjncJtbXRVJzrnnEuHyo0BCJ0MiK7pgYS1kwJQGH1OxIzQri5gcq2Dhpnpqvhlw8HsfDXftl9m298AWT588T3VA19LfVMrniZzqZXR6SgvCsme8abgix/rviW1HBxRwOZVevo2rJmFAD9sqdw3DvwPwbwb5Eq77pOHfAvqSG8vYH0ZetcrRfHBLTCLwPExOP6g1dp7q57gZ0zxnkNswN5YmNjCcSVIz02Mvho6iig44SihAm2QbRFTzg5E0paCYcSM/15Mmt+Be17WzgfuyI+80IrZU7ZXLa+UsMfSVpwSjowlJzlv1WMpei9dPVjt7OmG5re4/nFi1Pa/5Q7cEsgT+5cVMXRndv4c5jX31daKfc/XcHHta9xPpq6MyaN2vvACnlk22b6ULQXBS+73qRQndyzeT0XbZvjJVPo6UsNRNIAknvNSD3rbzBEyDCHNRnCAAAAAElFTkSuQmCC");
    nikiRight = loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABElJREFUWEfFl11sFGUUhp/vm112t1hraZF2SwsithQlJsS/GII/ESnt1moxWC4oRjEiXKBUFHujN0RMpJKgMZYYegGxYlKqQMFoYtQgEKGJGEIpNEpN+BHaipTd7XbnO2YGqiWy7G4p4VxsdpLznXnnvO8574ziJoe6yfdnRAByA0EpiJziZEY+Z8MnR1Rj6MFHdNi2RSb4CzkT68ZSekQ1rg+AGMnJCNJ78SRa32AA2YE8UQaUAoNCX4Zu3H9DvyAKtDL0hs+k1ZFrJvvyHpDcuTUwEGHfZ/UIXCEa53p45MaEr6OKZ7IcuKlFwsSx3iwZV1PPAJo5C5/kfOkMxGNj8LiVDTYKCxFxQWkxZIhFv8dw4K5CzkVSE2dCALd4siR7YT1xFI89X05zbci92bVCxEvF/qPsLxkFAE4HApaPuNI8vfM7mmorsAws+fEwP7z7MR1tG9w+vLXnEMf7onyz7FX6/thP+U+d7C0ppC96KiUaEiZlZRfLsjXv0LiyjsrWXTS9GAIymDTnBY5vWom3oASF4c7K5Rz7aBXGEqyJxZTt7eBgcSExFOejyWlICCAza6rMmD2PI99+TvWO7/l08TzAw8QnXuHExhVYk6egRHFP+XJ++WQVSg2iCqdRtreT9uJCovj4O/p70i4kTBgXCIoSg1FQ9cVumpZWg2gsMdjagCM+VxKXZsMZShvNU/s62VNcRM/1UjDWmy25NW8T0XEyT3cxc8N6Wh6ZgYhN7b4OzuBxd8PuWaUwOOhqM3Sgk8G45ufSIOci16kBp2D+ogaxlcbfdRAzeTpGLFd4zijqywNhdBxtPCjiLkXhLxvoS8MfknJ0tbHLGjNBlHa2o6IvcnpENVL2ggneArcLKGcjiMu4EyVzF6A1dOza6urEEaSzjlPlPmUAwdp1Du0Mtqxj1q9d2Nrjik9jsFDEBJQWPEYw2tA6JSOtjiRNDi5+T4ytCbes59FDR/hq6q0Jz5R1x2R30ZikNYfTmjS5oHat2MYisu0DQu3tbCnJu+LMeF+enB24pIPQiYjsmBRIWjMtAEW170vMCOGWBqrbO2malvk/AE5BB0TFbwOy8w7f6ALI8eeL79k6+lvXMb7qNbq2vKGcp77adNx/rJu20aYgx58nvgV1XNjWQHbNaro3rkjYgfLuAWkrGvUOJAcwpIGbAmA4FTcMgH9BHeGtDWQuWu3uenFMQCv8MkhMPK4/eJXm3vqX2T51lMcwN5AvNjaWQFw5q8dGLr+aOhvQcUJRwhjbINqiN5yaCaW8CYcSs/35Mn1uFR27WumJ/bf/54SWysyy2Wx6vY4/U7TgtPbAUHKO/3YxlqLv4pWv3c6Yrt3yIS/Nn5/W/KfdgdsC+XJ3ZQ2Htzfz1zCvf3BWtTz0XBWbV71JTzR9Z0wZtffhJfJ4cyP9KDqKg/+63rhQvdzXuIYLts3R0on09qcHImUAqX1mpJ/1D61lwDByIQvWAAAAAElFTkSuQmCC");
    nikiDown = loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABExJREFUWEfFl19sU3UUxz+/321pO5xzbMjasYGIG0OJCTFqDME/ERmjOB0GxwPDKEaEB5SJ4l70hYiJTBI0RohhDy5MTMYU2DCaGDUIRFgihjAmizIT/ghsIqPtut7fMffKYKil7RhyHpo2Ob/z+/Sc7znnXsUNNnWD72dYAPmBkBRGT3A8K8jpyPFhxRj848M6bNsi4/xFnIp3Yyk9rBjXBiBG8rJC9Fw4jtbXGSA3UCDKgFJgUOiL6Mb9NvgJokArQ0/kVEYZuaqzr+BeyZ9dDf1R9m6pQ+AK0Ti/h1p+XPgipngyx8FNz5I6jvbmyJjqOvrRzFr4GOfKpiEeG4PHjWywUViIiAulxZAlFn0ew/47ijgTTU+cSQFu8uRI7sI6EigefqaCppqwe9nVTMTL3H1H2Fc6AgBOBgKWj4TSPLHzaxpq5mIZWPLdIb596wM6Wje4eXh990GO9sb4ctlL9P62j4rvO9lTWkRv7ERaZUjqlJNbIsvWvMnGlbXMa2mj4bkwkMWEWc9ydPNKvIWlKAy3z1vOz++vwliCNb6E8j0dHCgpIo7iXCx1GZICZOdMlmkz53D4q0+o2vENHy2eA3gY/+iLHNu0AmviJJQo7qpYzo8frkKpAVTRFMr3dNJeUkQMH3/Gfk2ZhaQOYwIhUWIwCio/3UXD0ioQjSUGWxtwxOdK4u/ecJrSRvP43k52lxRz9lpLMNqbK/nVbxDVCbJPdjF9w3qaH5yGiE3N3g5O4XFnw64ZZTAw4GozvL+TgYTmh7IQZ6LXqAEnYHBRvdhK4+86gJk4FSOWKzynFfXFhjA6gTYeFAm3RJHP6unNYD+krNF/tV3OqHGitDMdFb3Rk8OKkfYuGOctdLOAciaCuBV3rHT2ArSGjratrk4cQTrjON3apw0QqlnnlJ2B5nXM+KkLW3tc8WkMFoq4gNKCxwhGG1omZWWUkZTOocVvi7E1keb1PHTwMJ9PvjnpmfLuuOwqHpUy5tCypnQurFkrtrGIbnuXcHs7jaUFl86M9RXI6f7LGggfi8qOCYGUMTMCKK55R+JGiDTXU9XeScOU7KQAc3/pl523+UYWIM8fFN9TtfS1rGNs5ct0Nb6aFKCiOy6tI12CPH+B+BbUcn5bPbnVq+netEI5qf9nezqlqOjul9biEc/AvwGcy4dCDOrgfwUYhBgqwusG4F9QS2RrPdmLVruzXpwloBV+GSAuHnc/eJXm7roX2D55hNswPxAUGxtLIKGc0WMjFx9NnQnobEJRwijbINqiJ5LeEkp7Eg465vqDMnV2JR1tLZyNX+79WeGlMr18JptfqeX3NFdwRnNg0DnPf6sYS9F74crHbqdN1za+x/Pz52fU/xln4JZAUO6cV82h7U38MWTX3zejSu5/upKPV73G2VjmmzFtau8DS+SRpo30oegoCV3aemPCdXLPxjWct22OlI2npy8ziLQB0nvNyNzrLxeQyDCoXNsKAAAAAElFTkSuQmCC");
    nikiLeft = loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABElJREFUWEfFl1tsVFUUhr+9zwwzU6y1tEg7vYBYW4oSE2LUGIKXiJQyWC2mlgeKUYwIDyiViH3RFyImUknQGCGGPkhANKXKpTWaGDVIG6GJGEKpEKUmXARagTIznc7Zy5wjVVCGmWmLrIfJTLL22v+s/1/rP0dxg0Pd4PsZFoDcQFAKIic4npHP6fDxYdUY+uPDOmzbIhP8RZyK9WApPawaIwMgRnIygvRePI7W1xlAdiBPlAGlwKDQl6Ab99vQJ4gCrQy94VNpdeSayb68eyV3di0MRGjf0oDAFaJxfl8euTHhi6jiySwHbmqRMHGsN0vG1TYwgGbWgsc4Vz4N8dgYPG5lg43CQkRcUFoMGWLR7zHsu6OIM5HUxJkQwE2eLMle0EAcxcPPVLK1LuRedq0Q8TK34zAdZaMAwOlAwPIRV5ondn1NU91cLAOLvzvIt2++T9fu9W4fXttzgCN9Ub5c+hJ9v3VQ+X03e8uK6IueSImGhElZ2aWydPUbbFhRz7yWVpqeCwEZTJz1LEc2rcBbUIbCcPu8Zfz83kqMJViFpVTs7WJ/aRExFOeiyWlICCAzq0SmzZzDoa8+pnrnN3y4aA7gofDRFzm2cTnWpMkoUdxVuYwfP1iJUoOooilU7O2ms7SIKD7OR39N2oWECeMCQVFiMAqqPmmjaUk1iMYSg60NOOJzJfHXbDhDaaN5vL2bPaXFnB0pBWO92ZJb+zoRHSfz5FGmr19H84PTELGpa+/iFB53N7TNKIfBQVeboX3dDMY1P5QHORMZoQacgvkLG8VWGv/R/ZhJUzFiucJzRlFfGgij42jjQRF3KQp/1khfGv6QlKOrjV3WmAmitLMdFX2Rk8OqkbIXTPAWuF1AORtBXMadKJtdg9bQ1brN1YkjSGcdp8p9ygCCdWsd2hlsXsuMn45ia48rPo3BQhETUFrwGMFoQ8vkjLQ6kjQ5uOgtMbYm3LyOhw4c4vOSmxOeqeiJSVvxmKQ1L6c1aXJB3RqxjUVk+zuEOjvZXJbnnhnvy5PTA1fyHzoWkZ0TA0lrpgWguO5tiRkh3NxIdWc3TVMylXO5U+TfAOb+MiC7bvONLoAcf774nqqnv2Ut46te5vynjVf1IwdMZU9Mdo82BTn+PPHV1HNheyPZtavo2bg8YQcqewZkd/God+C/ABJp4H8FcDUerhsAf0094W2NZC5c5e56cUxAK/wySEw8rj94lebuhhfYUTLKY5gbyBcbG0sgrpzVYyOXHk2dDeg4oShhjG0QbdEbTs2EUt6EQ4nZ/nyZOruKrtYWzsb+mf9ZoSUyvWImm16p5/cULTitPTCUnOO/VYyl6Lt45WO3M6ZrNr/L8/PnpzX/aXfglkC+3DmvloM7tvLHZV5/34xquf/pKj5a+Spno+k7Y8qovQ8slke2bqAfRVdp8G/XGxdqkHs2rOaCbXO4vJDe/vRApAwgtdeM9LP+BPlVwzC3cxZiAAAAAElFTkSuQmCC");

    // Fetch and compile the grammar
    fetch('grammar.pegjs')
        .then(response => response.text())
        .then(grammar => {
            parser = peggy.generate(grammar);
            logOutput("Parser loaded.");
        })
        .catch(error => {
            console.error("Error loading or compiling grammar:", error);
            logError("Failed to load parser. Check console.");
        });
}

function setup() {
    let canvas = createCanvas(ARR_COLS * RECT_WIDTH, ARR_ROWS * RECT_HEIGHT);
    canvas.parent('canvas-container'); // Put canvas in the container div
    resetNiki(); // Initialize grid and Niki's state

    // Event Listeners
    document.getElementById('run-button').addEventListener('click', runCode);
    document.getElementById('reset-button').addEventListener('click', resetNiki);
    document.getElementById('builder-mode-checkbox').addEventListener('change', (e) => {
        builderMode = e.target.checked;
    });

    logOutput("Setup complete. Ready to run code or build.");
}

function resetNiki() {
    nikiCol = Math.floor(ARR_COLS / 2); // Start near center
    nikiRow = Math.floor(ARR_ROWS / 2);
    nikiDirection = (1 << 30); // North
    nikiNumOfBalls = 5; // Start with some balls
    createGrid();
    procedures = {}; // Clear user procedures
    logOutput("Niki and grid reset.");
    clearError();
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
}

// --- Drawing ---
function draw() {
    background(220);
    drawGrid();
    drawNiki();
}

function drawGrid() {
    stroke(0);
    strokeWeight(1);
    for (let i = 0; i < ARR_COLS; i++) {
        for (let j = 0; j < ARR_ROWS; j++) {
            fill(255); // White square
            rect(i * RECT_WIDTH, j * RECT_HEIGHT, RECT_WIDTH, RECT_HEIGHT);

            // Draw balls
            if (grid[i][j].numOfBalls > 0) {
                fill(0, 0, 255); // Blue balls
                noStroke();
                // Simple ball drawing for now
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
                stroke(0); // Reset stroke
            }

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
            strokeWeight(1);
            stroke(0); // Reset stroke
        }
    }
}

function drawNiki() {
    let img;
    switch (nikiDirection % 4) {
        case 0: img = nikiUp; break;
        case 1: img = nikiRight; break; // Corrected: 1=East=Right
        case 2: img = nikiDown; break;
        case 3: img = nikiLeft; break;  // Corrected: 3=West=Left
    }
     if (img && nikiCol >= 0 && nikiCol < ARR_COLS && nikiRow >= 0 && nikiRow < ARR_ROWS) {
        image(img, nikiCol * RECT_WIDTH, nikiRow * RECT_HEIGHT, RECT_WIDTH, RECT_HEIGHT);
    }
    // Draw ball count on Niki
    fill(0);
    textSize(10);
    textAlign(CENTER, CENTER);
     if (nikiCol >= 0 && nikiCol < ARR_COLS && nikiRow >= 0 && nikiRow < ARR_ROWS) {
       text(nikiNumOfBalls, nikiCol * RECT_WIDTH + RECT_WIDTH / 2, nikiRow * RECT_HEIGHT + RECT_HEIGHT / 2);
    }
}

// --- Builder Mode Mouse Interaction ---
function mousePressed() {
    if (!builderMode || mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height) {
        return; // Only operate within canvas and in builder mode
    }

    const col = Math.floor(mouseX / RECT_WIDTH);
    const row = Math.floor(mouseY / RECT_HEIGHT);

    if (col < 0 || col >= ARR_COLS || row < 0 || row >= ARR_ROWS) return;

    const xInRect = mouseX % RECT_WIDTH;
    const yInRect = mouseY % RECT_HEIGHT;
    const borderZone = RECT_WIDTH / 4; // How close to edge for wall placement

    // Check for wall placement first (edges are priority)
    let wallPlaced = false;
    // Top wall
    if (yInRect < borderZone) {
        if (row > 0) {
            grid[col][row].topWall = !grid[col][row].topWall;
            grid[col][row - 1].bottomWall = grid[col][row].topWall;
            wallPlaced = true;
        }
    }
    // Bottom wall
    else if (yInRect > RECT_HEIGHT - borderZone) {
         if (row < ARR_ROWS - 1) {
            grid[col][row].bottomWall = !grid[col][row].bottomWall;
            grid[col][row + 1].topWall = grid[col][row].bottomWall;
            wallPlaced = true;
         }
    }
    // Left wall
    else if (xInRect < borderZone) {
        if (col > 0) {
            grid[col][row].leftWall = !grid[col][row].leftWall;
            grid[col - 1][row].rightWall = grid[col][row].leftWall;
            wallPlaced = true;
        }
    }
    // Right wall
    else if (xInRect > RECT_WIDTH - borderZone) {
         if (col < ARR_COLS - 1) {
            grid[col][row].rightWall = !grid[col][row].rightWall;
            grid[col + 1][row].leftWall = grid[col][row].rightWall;
            wallPlaced = true;
         }
    }

    // If no wall was placed, check for placing Niki or balls
    if (!wallPlaced) {
        // Place/remove ball (Right-click to remove)
        if (mouseButton === LEFT) {
             grid[col][row].numOfBalls++;
        } else if (mouseButton === RIGHT) {
             grid[col][row].numOfBalls = max(0, grid[col][row].numOfBalls - 1);
        }
    }
     // Prevent default right-click menu only on canvas
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
        return false;
    }
}

// Middle click to place Niki
function mouseClicked() {
     if (!builderMode || mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height) {
        return;
    }
     const col = Math.floor(mouseX / RECT_WIDTH);
    const row = Math.floor(mouseY / RECT_HEIGHT);
     if (col < 0 || col >= ARR_COLS || row < 0 || row >= ARR_ROWS) return;

    if (mouseButton === CENTER) {
         nikiCol = col;
         nikiRow = row;
         logOutput(`Niki placed at (${col}, ${row})`);
    }
}


// --- Code Execution ---
function runCode() {
    if (!parser) {
        logError("Parser not ready yet.");
        return;
    }

    const code = document.getElementById('code-editor').value;
    clearError();
    logOutput("Parsing code...");

    try {
        const ast = parser.parse(code);
        logOutput("Parsing successful. Executing...");
        procedures = {}; // Reset procedures before execution

        // First pass: Register procedures
        if (ast.declarations && ast.declarations.length > 0) {
            ast.declarations.forEach(decl => {
                if (decl.type === 'procedureDeclaration') {
                    if (NIKI_FUNCTIONS[decl.name]) {
                         throw new Error(`Cannot redefine built-in function: ${decl.name}`);
                    }
                    if (procedures[decl.name]) {
                         throw new Error(`Procedure already defined: ${decl.name}`);
                    }
                    procedures[decl.name] = decl.body; // Store AST body
                     logOutput(`Registered procedure: ${decl.name}`);
                }
            });
        }


        // Second pass: Execute main block
        executeASTNode(ast.main);
        logOutput("Execution finished.");

    } catch (e) {
        logError(`Error: ${e.message}`);
        if (e.location) {
             logError(`  at line ${e.location.start.line}, column ${e.location.start.column}`);
        }
        console.error(e); // Log full error to console
    }
}

// --- AST Interpreter ---
function executeASTNode(node) {
    if (!node) return; // Handle empty branches (like missing else)

    switch (node.type) {
        case 'block':
            node.statements.forEach(stmt => executeASTNode(stmt));
            break;

        case 'procedureCall':
            const procName = node.name;
            if (NIKI_FUNCTIONS[procName]) {
                // Built-in Niki function
                NIKI_FUNCTIONS[procName]();
            } else if (procedures[procName]) {
                // User-defined procedure
                 logOutput(`Executing procedure: ${procName}`);
                executeASTNode(procedures[procName]); // Execute stored body
            } else {
                throw new Error(`Undefined procedure called: ${procName}`);
            }
            break;

        case 'ifStatement':
             logOutput("Evaluating IF condition...");
            const conditionMet = evaluateExpression(node.condition);
            if (conditionMet) {
                 logOutput("IF condition TRUE, executing THEN branch.");
                executeASTNode(node.thenBranch);
            } else if (node.elseBranch) {
                 logOutput("IF condition FALSE, executing ELSE branch.");
                executeASTNode(node.elseBranch);
            } else {
                 logOutput("IF condition FALSE, no ELSE branch.");
            }
            break;

        case 'repeatStatement':
            let loopCount = 0;
            const maxLoops = 1000; // Prevent infinite loops
             logOutput("Entering REPEAT loop...");
            do {
                executeASTNode(node.body);
                loopCount++;
                if (loopCount > maxLoops) {
                    throw new Error("Maximum loop iterations exceeded in REPEAT statement.");
                }
                 logOutput(`Loop condition check (iteration ${loopCount})...`);
            } while (!evaluateExpression(node.condition)); // Loop UNTIL condition is true
             logOutput("Exiting REPEAT loop.");
            break;

        // Other node types (program, procedureDeclaration) handled during setup/runCode

        default:
            console.warn(`Interpreter doesn't handle AST node type: ${node.type}`);
    }
}

function evaluateExpression(node) {
    switch (node.type) {
        case 'identifier':
            const funcName = node.name;
            if (NIKI_FUNCTIONS[funcName] && typeof NIKI_FUNCTIONS[funcName] === 'function') {
                // Assume identifiers in expressions are condition functions
                const result = NIKI_FUNCTIONS[funcName]();
                 logOutput(`Evaluated condition '${funcName}': ${result}`);
                return result;
            } else {
                throw new Error(`Cannot evaluate identifier as condition: ${funcName}. Is it a valid Niki condition function?`);
            }

        case 'negatedExpression':
            const innerResult = evaluateExpression(node.expression);
             logOutput(`Evaluated NOT expression: !(${node.expression?.name || 'complex'}) -> !${innerResult} -> ${!innerResult}`);
            return !innerResult;

        default:
            throw new Error(`Cannot evaluate expression node type: ${node.type}`);
    }
}


// --- Logging ---
const errorLog = document.getElementById('error-log');
function logOutput(message) {
    console.log("NIKI:", message);
    // Optional: Display non-error messages somewhere if needed
    // errorLog.textContent = message; // Example: show last status
    // errorLog.style.color = 'green';
}

function logError(message) {
    console.error("NIKI ERROR:", message);
    errorLog.textContent = message;
    errorLog.style.color = 'red';
}

function clearError() {
    errorLog.textContent = '';
} 