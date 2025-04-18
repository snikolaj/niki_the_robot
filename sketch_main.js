// --- Main p5.js Sketch File ---

// Add global variables for the new elements
let saveButtonElement;
let loadButtonElement;
let loadFileInputElement;
let exampleSelectElement;
let saveGridButtonElement;
let loadGridButtonElement;
let loadGridInputElement;
let colsInputElement;
let rowsInputElement;
let applyDimensionsButtonElement;
let helpButtonElement;
let instructionsModalElement;
let closeModalButtonElement;
let p5Canvas;
let isCodeSaved = false;
let isGridSaved = true; // Track grid changes

function preload() {
    logOutput("Preloading assets...");
    // Load Niki images
    // Encoded images included directly for simplicity
    nikiUp = loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABEZJREFUWEfNl19sk2UUxn/v+7W0Hc45NtzWsYGIG0OJCTFqzIJ/IjJGcToMjguGUYwIFyhzirvRGyImbpKgMUIMu3ARMRlT/hpNjBocRFgihjAmizITYAKbyGi7rt97zPe5wTBubccInoumTc573qfnOed5vk9xg0Pd4PsZE4DsQFDyI6c5lZbH2fCpMdUY+uNjOmzbIjn+ArpjXVhKj6nGtQEQI1lpQXounULr6wwgM5AryoBSYFDoQejG/Tb0CaJAK0NPuDuljoya7Mu9V7LnV0F/hAOf1CFw1dA4v4dHdkz4Mqp4MsOBm1yMmDjRmyGTquroRzNv6WNcKJmNeGwMHreywUZhISIuKC2GNLHo8xgO3VHAuUhywzkigJs8GZK5tI44ioefKWdbdci9bLQQ8bLw4HEOFo8DAKcDActHXGme2P0NjdULsQys+P4o3731Ae17Nrl9eH3/EU70Rvlq1Uv0/n6Q8h86aC0uoDd6OikaRkzKyCySVevfZPPaGha17KXxuRCQxtR5z3Ji61q8+cUoDLcvWs0v79diLMGaUkRZazuHiwqIobgQTUzDiADSM2bI7LkLOPb1p1Tu+paPli8APEx59EVOblmDNW06ShR3la/mpw9rUWoAVTCTstYO2ooKiOLjr+hvCbswYsKkQFCUGIyCis/20biyEkRjicHWBpzhc0fin91wltJG8/iBDvYXFXL+WimY6M2U7Ko3iOg46Wc6mbNpI80PzkbEpvpAO914XG3YV1oCAwPubIYOdTAQ1/xYEuRc5BpnwCmYt6xBbKXxdx7GTJuFEcsdPGcV9eBCGB1HGw+KuEtR+PMGelPwh4Qc/dfaZUzIEaUddVT0Rs6MqUbSXpDjzXe7gHIUQVzGnSievwStoX3vdndOnIF05DhZ7pMGEKyud2hnoLme0p87sbXHHT6NwUIRE1Ba8BjBaEPL9LSUOpIwObj8bTG2Jty8kYeOHOOLGTdfPjPZlytn+69QUNYVk32FExLWHE5rwuT86g1iG4vIjncJtbXRVJzrnnEuHyo0BCJ0MiK7pgYS1kwJQGH1OxIzQri5gcq2Dhpnpqvhlw8HsfDXftl9m298AWT588T3VA19LfVMrniZzqZXR6SgvCsme8abgix/rviW1HBxRwOZVevo2rJmFAD9sqdw3DvwPwbwb5Eq77pOHfAvqSG8vYH0ZetcrRfHBLTCLwPExOP6g1dp7q57gZ0zxnkNswN5YmNjCcSVIz02Mvho6iig44SihAm2QbRFTzg5E0paCYcSM/15Mmt+Be17WzgfuyI+80IrZU7ZXLa+UsMfSVpwSjowlJzlv1WMpei9dPVjt7OmG5re4/nFi1Pa/5Q7cEsgT+5cVMXRndv4c5jX31daKfc/XcHHta9xPpq6MyaN2vvACnlk22b6ULQXBS+73qRQndyzeT0XbZvjJVPo6UsNRNIAknvNSD3rbzBEyDCHNRnCAAAAAElFTkSuQmCC");
    nikiRight = loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABElJREFUWEfFl11sFGUUhp/vm112t1hraZF2SwsithQlJsS/GII/ESnt1moxWC4oRjEiXKBUFHujN0RMpJKgMZYYegGxYlKqQMFoYtQgEKGJGEIpNEpN+BHaipTd7XbnO2YGqiWy7G4p4VxsdpLznXnnvO8574ziJoe6yfdnRAByA0EpiJziZEY+Z8MnR1Rj6MFHdNi2RSb4CzkT68ZSekQ1rg+AGMnJCNJ78SRa32AA2YE8UQaUAoNCX4Zu3H9DvyAKtDL0hs+k1ZFrJvvyHpDcuTUwEGHfZ/UIXCEa53p45MaEr6OKZ7IcuKlFwsSx3iwZV1PPAJo5C5/kfOkMxGNj8LiVDTYKCxFxQWkxZIhFv8dw4K5CzkVSE2dCALd4siR7YT1xFI89X05zbci92bVCxEvF/qPsLxkFAE4HApaPuNI8vfM7mmorsAws+fEwP7z7MR1tG9w+vLXnEMf7onyz7FX6/thP+U+d7C0ppC96KiUaEiZlZRfLsjXv0LiyjsrWXTS9GAIymDTnBY5vWom3oASF4c7K5Rz7aBXGEqyJxZTt7eBgcSExFOejyWlICCAza6rMmD2PI99+TvWO7/l08TzAw8QnXuHExhVYk6egRHFP+XJ++WQVSg2iCqdRtreT9uJCovj4O/p70i4kTBgXCIoSg1FQ9cVumpZWg2gsMdjagCM+VxKXZsMZShvNU/s62VNcRM/1UjDWmy25NW8T0XEyT3cxc8N6Wh6ZgYhN7b4OzuBxd8PuWaUwOOhqM3Sgk8G45ufSIOci16kBp2D+ogaxlcbfdRAzeTpGLFd4zijqywNhdBxtPCjiLkXhLxvoS8MfknJ0tbHLGjNBlHa2o6IvcnpENVL2ggneArcLKGcjiMu4EyVzF6A1dOza6urEEaSzjlPlPmUAwdp1Du0Mtqxj1q9d2Nrjik9jsFDEBJQWPEYw2tA6JSOtjiRNDi5+T4ytCbes59FDR/hq6q0Jz5R1x2R30ZikNYfTmjS5oHat2MYisu0DQu3tbCnJu+LMeF+enB24pIPQiYjsmBRIWjMtAEW170vMCOGWBqrbO2malvk/AE5BB0TFbwOy8w7f6ALI8eeL79k6+lvXMb7qNbq2vKGcp77adNx/rJu20aYgx58nvgV1XNjWQHbNaro3rkjYgfLuAWkrGvUOJAcwpIGbAmA4FTcMgH9BHeGtDWQuWu3uenFMQCv8MkhMPK4/eJXm3vqX2T51lMcwN5AvNjaWQFw5q8dGLr+aOhvQcUJRwhjbINqiN5yaCaW8CYcSs/35Mn1uFR27WumJ/bf/54SWysyy2Wx6vY4/U7TgtPbAUHKO/3YxlqLv4pWv3c6Yrt3yIS/Nn5/W/KfdgdsC+XJ3ZQ2Htzfz1zCvf3BWtTz0XBWbV71JTzR9Z0wZtffhJfJ4cyP9KDqKg/+63rhQvdzXuIYLts3R0on09qcHImUAqX1mpJ/1D61lwDByIQvWAAAAAElFTkSuQmCC");
    nikiDown = loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABExJREFUWEfFl19sU3UUxz+/321pO5xzbMjasYGIG0OJCTFqDME/ERmjOB0GxwPDKEaEB5SJ4l70hYiJTBI0RohhDy5MTMYU2DCaGDUIRFgihjAmizIT/ghsIqPtut7fMffKYKil7RhyHpo2Ob/z+/Sc7znnXsUNNnWD72dYAPmBkBRGT3A8K8jpyPFhxRj848M6bNsi4/xFnIp3Yyk9rBjXBiBG8rJC9Fw4jtbXGSA3UCDKgFJgUOiL6Mb9NvgJokArQ0/kVEYZuaqzr+BeyZ9dDf1R9m6pQ+AK0Ti/h1p+XPgipngyx8FNz5I6jvbmyJjqOvrRzFr4GOfKpiEeG4PHjWywUViIiAulxZAlFn0ew/47ijgTTU+cSQFu8uRI7sI6EigefqaCppqwe9nVTMTL3H1H2Fc6AgBOBgKWj4TSPLHzaxpq5mIZWPLdIb596wM6Wje4eXh990GO9sb4ctlL9P62j4rvO9lTWkRv7ERaZUjqlJNbIsvWvMnGlbXMa2mj4bkwkMWEWc9ydPNKvIWlKAy3z1vOz++vwliCNb6E8j0dHCgpIo7iXCx1GZICZOdMlmkz53D4q0+o2vENHy2eA3gY/+iLHNu0AmviJJQo7qpYzo8frkKpAVTRFMr3dNJeUkQMH3/Gfk2ZhaQOYwIhUWIwCio/3UXD0ioQjSUGWxtwxOdK4u/ecJrSRvP43k52lxRz9lpLMNqbK/nVbxDVCbJPdjF9w3qaH5yGiE3N3g5O4XFnw64ZZTAw4GozvL+TgYTmh7IQZ6LXqAEnYHBRvdhK4+86gJk4FSOWKzynFfXFhjA6gTYeFAm3RJHP6unNYD+krNF/tV3OqHGitDMdFb3Rk8OKkfYuGOctdLOAciaCuBV3rHT2ArSGjratrk4cQTrjON3apw0QqlnnlJ2B5nXM+KkLW3tc8WkMFoq4gNKCxwhGG1omZWWUkZTOocVvi7E1keb1PHTwMJ9PvjnpmfLuuOwqHpUy5tCypnQurFkrtrGIbnuXcHs7jaUFl86M9RXI6f7LGggfi8qOCYGUMTMCKK55R+JGiDTXU9XeScOU7KQAc3/pl523+UYWIM8fFN9TtfS1rGNs5ct0Nb6aFKCiOy6tI12CPH+B+BbUcn5bPbnVq+netEI5qf9nezqlqOjul9biEc/AvwGcy4dCDOrgfwUYhBgqwusG4F9QS2RrPdmLVruzXpwloBV+GSAuHnc/eJXm7roX2D55hNswPxAUGxtLIKGc0WMjFx9NnQnobEJRwijbINqiJ5LeEkp7Eg465vqDMnV2JR1tLZyNX+79WeGlMr18JptfqeX3NFdwRnNg0DnPf6sYS9F74crHbqdN1za+x/Pz52fU/xln4JZAUO6cV82h7U38MWTX3zejSu5/upKPV73G2VjmmzFtau8DS+SRpo30oegoCV3aemPCdXLPxjWct22OlI2npy8ziLQB0nvNyNzrLxeQyDCoXNsKAAAAAElFTkSuQmCC");
    nikiLeft = loadImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABElJREFUWEfFl1tsVFUUhr+9zwwzU6y1tEg7vYBYW4oSE2LUGIKXiJQyWC2mlgeKUYwIDyiViH3RFyImUknQGCGGPkhANKXKpTWaGDVIG6GJGEKpEKUmXARagTIznc7Zy5wjVVCGmWmLrIfJTLL22v+s/1/rP0dxg0Pd4PsZFoDcQFAKIic4npHP6fDxYdUY+uPDOmzbIhP8RZyK9WApPawaIwMgRnIygvRePI7W1xlAdiBPlAGlwKDQl6Ab99vQJ4gCrQy94VNpdeSayb68eyV3di0MRGjf0oDAFaJxfl8euTHhi6jiySwHbmqRMHGsN0vG1TYwgGbWgsc4Vz4N8dgYPG5lg43CQkRcUFoMGWLR7zHsu6OIM5HUxJkQwE2eLMle0EAcxcPPVLK1LuRedq0Q8TK34zAdZaMAwOlAwPIRV5ondn1NU91cLAOLvzvIt2++T9fu9W4fXttzgCN9Ub5c+hJ9v3VQ+X03e8uK6IueSImGhElZ2aWydPUbbFhRz7yWVpqeCwEZTJz1LEc2rcBbUIbCcPu8Zfz83kqMJViFpVTs7WJ/aRExFOeiyWlICCAzq0SmzZzDoa8+pnrnN3y4aA7gofDRFzm2cTnWpMkoUdxVuYwfP1iJUoOooilU7O2ms7SIKD7OR39N2oWECeMCQVFiMAqqPmmjaUk1iMYSg60NOOJzJfHXbDhDaaN5vL2bPaXFnB0pBWO92ZJb+zoRHSfz5FGmr19H84PTELGpa+/iFB53N7TNKIfBQVeboX3dDMY1P5QHORMZoQacgvkLG8VWGv/R/ZhJUzFiucJzRlFfGgij42jjQRF3KQp/1khfGv6QlKOrjV3WmAmitLMdFX2Rk8OqkbIXTPAWuF1AORtBXMadKJtdg9bQ1brN1YkjSGcdp8p9ygCCdWsd2hlsXsuMn45ia48rPo3BQhETUFrwGMFoQ8vkjLQ6kjQ5uOgtMbYm3LyOhw4c4vOSmxOeqeiJSVvxmKQ1L6c1aXJB3RqxjUVk+zuEOjvZXJbnnhnvy5PTA1fyHzoWkZ0TA0lrpgWguO5tiRkh3NxIdWc3TVMylXO5U+TfAOb+MiC7bvONLoAcf774nqqnv2Ut46te5vynjVf1IwdMZU9Mdo82BTn+PPHV1HNheyPZtavo2bg8YQcqewZkd/God+C/ABJp4H8FcDUerhsAf0094W2NZC5c5e56cUxAK/wySEw8rj94lebuhhfYUTLKY5gbyBcbG0sgrpzVYyOXHk2dDeg4oShhjG0QbdEbTs2EUt6EQ4nZ/nyZOruKrtYWzsb+mf9ZoSUyvWImm16p5/cULTitPTCUnOO/VYyl6Lt45WO3M6ZrNr/L8/PnpzX/aXfglkC+3DmvloM7tvLHZV5/34xquf/pKj5a+Spno+k7Y8qovQ8slke2bqAfRVdp8G/XGxdqkHs2rOaCbXO4vJDe/vRApAwgtdeM9LP+BPlVwzC3cxZiAAAAAElFTkSuQmCC");

    // Fetch and compile the grammar file
    loadAndCompileGrammar();
    logOutput("Preload finished.");
}

function setup() {
    logOutput("Setting up canvas and listeners...");
    p5Canvas = createCanvas(ARR_COLS * RECT_WIDTH, ARR_ROWS * RECT_HEIGHT);
    p5Canvas.parent('canvas-container');

    // Cache HTML elements
    runButtonElement = document.getElementById('run-button');
    speedSliderElement = document.getElementById('speed-slider');
    const editor = document.getElementById('code-editor');
    errorLogElement = document.getElementById('error-log'); // Initialize here
    ballCounterElement = document.getElementById('ball-counter'); // Initialize here
    speedLabelElement = document.getElementById('speed-label'); // Initialize here
    saveButtonElement = document.getElementById('save-button'); // Cache save button
    loadButtonElement = document.getElementById('load-button'); // Cache load button
    loadFileInputElement = document.getElementById('load-file-input'); // Cache file input
    exampleSelectElement = document.getElementById('example-select'); // Cache example select
    saveGridButtonElement = document.getElementById('save-grid-button');
    loadGridButtonElement = document.getElementById('load-grid-button');
    loadGridInputElement = document.getElementById('load-grid-input');
    colsInputElement = document.getElementById('cols-input');
    rowsInputElement = document.getElementById('rows-input');
    applyDimensionsButtonElement = document.getElementById('apply-dimensions-button');
    helpButtonElement = document.getElementById('help-button');
    instructionsModalElement = document.getElementById('instructions-modal');
    // Get close button inside modal
    closeModalButtonElement = instructionsModalElement.querySelector('.close-button');


    // --- Event Listeners ---
    p5Canvas.elt.addEventListener('contextmenu', (e) => e.preventDefault()); // Keep this for disabling right-click menu
    runButtonElement.addEventListener('click', runCode); // runCode is now async
    document.getElementById('reset-button').addEventListener('click', resetNiki);
    document.getElementById('builder-mode-checkbox').addEventListener('change', handleBuilderModeToggle);
    saveButtonElement.addEventListener('click', saveCodeToFile); // Add listener for save
    loadButtonElement.addEventListener('click', () => loadFileInputElement.click()); // Trigger file input on load click
    loadFileInputElement.addEventListener('change', loadFileContent); // Add listener for file selection
    exampleSelectElement.addEventListener('change', loadSelectedExample); // Add listener for example select
    saveGridButtonElement.addEventListener('click', saveGridToFile);
    loadGridButtonElement.addEventListener('click', () => loadGridInputElement.click());
    loadGridInputElement.addEventListener('change', loadGridFromFile);
    applyDimensionsButtonElement.addEventListener('click', applyNewDimensions);
    handleTabInTextarea(editor); // Keep this

    // Add listeners for modal
    helpButtonElement.addEventListener('click', () => {
        instructionsModalElement.style.display = 'block';
        logOutput("Instructions opened.");
    });
    closeModalButtonElement.addEventListener('click', () => {
        instructionsModalElement.style.display = 'none';
        logOutput("Instructions closed.");
    });
    // Optional: Close modal if clicked outside content
    window.addEventListener('click', (event) => {
        if (event.target === instructionsModalElement) {
            instructionsModalElement.style.display = 'none';
            logOutput("Instructions closed (clicked outside).");
        }
    });


    // --- Listener for code editor changes ---
    editor.addEventListener('input', () => {
        if (isCodeSaved) {
            isCodeSaved = false;
        }
    });

    // Speed Slider Listener
    speedSliderElement.addEventListener('input', (e) => {
        commandsPerSecond = parseInt(e.target.value, 10);
        updateSpeedLabel();
    });

    // --- Before Unload Listener ---
    window.addEventListener('beforeunload', (event) => {
        if (!isCodeSaved) {
            console.log("Beforeunload listener: Unsaved changes detected.");
            const confirmationMessage = 'You have unsaved code. Are you sure you want to leave?';
            event.preventDefault();
            event.returnValue = confirmationMessage;
            return confirmationMessage;
        }
        if (!isGridSaved) {
            console.log("Beforeunload listener: Unsaved grid changes detected.");
            const confirmationMessage = 'You have unsaved grid changes. Are you sure you want to leave?';
            event.preventDefault();
            event.returnValue = confirmationMessage;
            return confirmationMessage;
        }
    });
    // --- End Before Unload Listener ---

    // --- End Event Listeners ---

    // Initialize state and display
    populateExampleDropdown(); // Fill the dropdown
    colsInputElement.value = ARR_COLS;
    rowsInputElement.value = ARR_ROWS;
    resetNiki(); // Sets initial state, calls createGrid etc.
    updateSpeedLabel(); // Set initial speed label text
    logOutput("Setup complete. Ready.");
}

function draw() {
    background(220);
    drawGridBase();
    drawNiki();
    drawGridItems();
}

function resetNiki() {
    logOutput("Resetting Niki state and grid...");

    // --- Stop any ongoing execution ---
    isExecuting = false; // Signal running code to stop (if checked within loops)
    if (runButtonElement) {
        runButtonElement.disabled = false; // Re-enable run button
        runButtonElement.textContent = "Run Code";
    }
    // --- End Stop execution ---

    // Reset Niki's position, direction, balls
    nikiCol = Math.floor(ARR_COLS / 2);
    nikiRow = Math.floor(ARR_ROWS / 2);
    nikiDirection = (1 << 30);
    nikiNumOfBalls = 5;

    createGrid();
    procedures = {};
    clearError();
    updateBallCounterDisplay();
    isCodeSaved = false;
    isGridSaved = true;
    logOutput("Reset complete.");
}

// --- Save and Load Functions ---

function saveCodeToFile() {
    const codeToSave = document.getElementById('code-editor').value;
    const blob = new Blob([codeToSave], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'niki_code.pas'; // Default filename
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Clean up
    URL.revokeObjectURL(url); // Release object URL
    logOutput("Code saved to niki_code.pas");
    isCodeSaved = true;
}

function loadFileContent(event) {
    const file = event.target.files[0];
    if (!file) {
        logOutput("No file selected.");
        event.target.value = null;
        return;
    }

    if (!isCodeSaved) {
        const proceed = confirm("Loading this file will overwrite unsaved changes in the editor. Are you sure you want to continue?");
        if (!proceed) {
            logOutput("File load cancelled by user.");
            event.target.value = null;
            return;
        }
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        document.getElementById('code-editor').value = content;
        logOutput(`File "${file.name}" loaded successfully.`);
        isCodeSaved = false;
        clearError();
    };
    reader.onerror = function(e) {
        logError(`Error reading file "${file.name}": ${e.target.error}`);
        console.error("File reading error:", e.target.error);
    };
    reader.readAsText(file);

    event.target.value = null;
}

function saveGridToFile() {
    const gridData = {
        dimensions: { cols: ARR_COLS, rows: ARR_ROWS },
        niki: {
            col: nikiCol,
            row: nikiRow,
            direction: nikiDirection,
            balls: nikiNumOfBalls
        },
        squares: []
    };

    for (let i = 0; i < ARR_COLS; i++) {
        for (let j = 0; j < ARR_ROWS; j++) {
            const square = grid[i][j];
            const hasData = square.numOfBalls > 0 || square.topWall || square.rightWall || square.bottomWall || square.leftWall;

            if (hasData) {
                const squareData = { col: i, row: j };
                if (square.numOfBalls > 0) squareData.balls = square.numOfBalls;
                if (square.topWall) squareData.top = true;
                if (square.rightWall) squareData.right = true;
                if (square.bottomWall) squareData.bottom = true;
                if (square.leftWall) squareData.left = true;
                gridData.squares.push(squareData);
            }
        }
    }

    const jsonString = JSON.stringify(gridData, null, 2); // Pretty print JSON
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'niki_grid.json'; // Default filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    logOutput("Grid saved to niki_grid.json");
    isGridSaved = true; // Mark grid as saved
}

function loadGridFromFile(event) {
    const file = event.target.files[0];
    if (!file) {
        logOutput("No grid file selected.");
        event.target.value = null;
        return;
    }

    // Check for unsaved changes *before* reading the file
    if (!isGridSaved) {
        const proceedUnsaved = confirm("Loading a new grid will overwrite unsaved changes. Are you sure you want to continue?");
        if (!proceedUnsaved) {
            logOutput("Grid load cancelled by user (unsaved changes).");
            event.target.value = null;
            return;
        }
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const gridData = JSON.parse(e.target.result);

            // --- Validation (Basic Structure) ---
            if (!gridData || typeof gridData !== 'object') throw new Error("Invalid JSON structure.");
            if (!gridData.dimensions || typeof gridData.dimensions !== 'object') throw new Error("Missing or invalid dimensions data in JSON.");
            const fileCols = gridData.dimensions.cols;
            const fileRows = gridData.dimensions.rows;
            if (typeof fileCols !== 'number' || typeof fileRows !== 'number' || fileCols < 1 || fileRows < 1) {
                 throw new Error(`Invalid dimensions (${fileCols}x${fileRows}) found in JSON file.`);
            }
            if (!gridData.niki || typeof gridData.niki !== 'object') throw new Error("Missing or invalid Niki data.");
            if (!Array.isArray(gridData.squares)) throw new Error("Missing or invalid squares data.");


            // --- Handle Dimension Mismatch ---
            if (fileCols !== ARR_COLS || fileRows !== ARR_ROWS) {
                const proceedResize = confirm(`The loaded grid has different dimensions (${fileCols}x${fileRows}). Apply these dimensions? This will reset the current grid and Niki's position before loading.`);
                if (proceedResize) {
                    logOutput(`Resizing grid to match file: ${fileCols}x${fileRows}`);
                    ARR_COLS = fileCols;
                    ARR_ROWS = fileRows;
                    colsInputElement.value = ARR_COLS; // Update UI input
                    rowsInputElement.value = ARR_ROWS; // Update UI input
                    resizeCanvas(ARR_COLS * RECT_WIDTH, ARR_ROWS * RECT_HEIGHT);
                    // createGrid() will be called next as part of the reset logic
                } else {
                    logOutput("Grid load cancelled by user (dimension mismatch).");
                    event.target.value = null;
                    return; // Stop loading
                }
            }

            // --- Reset and Apply ---
            // Reset grid to default empty state *with potentially new dimensions*
            // We avoid calling resetNiki() here as it resets Niki's ball count etc.
            // which we want to load from the file.
            createGrid();
            clearError(); // Clear previous errors

            // Restore Niki state from file
            nikiCol = gridData.niki.col ?? Math.floor(ARR_COLS / 2);
            nikiRow = gridData.niki.row ?? Math.floor(ARR_ROWS / 2);
            // Validate Niki's position against new grid size
            if (nikiCol < 0 || nikiCol >= ARR_COLS || nikiRow < 0 || nikiRow >= ARR_ROWS) {
                logWarn(`Niki position (${gridData.niki.col}, ${gridData.niki.row}) from file is outside the new grid bounds (${ARR_COLS}x${ARR_ROWS}). Resetting to center.`);
                 nikiCol = Math.floor(ARR_COLS / 2);
                 nikiRow = Math.floor(ARR_ROWS / 2);
            }
            nikiDirection = gridData.niki.direction ?? (1 << 30); // Default UP
            nikiNumOfBalls = gridData.niki.balls ?? 0;
            updateBallCounterDisplay();


            // Apply square data from file
            gridData.squares.forEach(squareData => {
                const { col, row, balls, top, right, bottom, left } = squareData;
                if (col >= 0 && col < ARR_COLS && row >= 0 && row < ARR_ROWS) {
                    const square = grid[col][row];
                    square.numOfBalls = balls || 0;

                    // Set walls, ensuring consistency with neighbors
                    if (top) {
                        square.topWall = true;
                        if (row > 0) grid[col][row - 1].bottomWall = true;
                    }
                    if (bottom) {
                        square.bottomWall = true;
                        if (row < ARR_ROWS - 1) grid[col][row + 1].topWall = true;
                    }
                    if (left) {
                        square.leftWall = true;
                        if (col > 0) grid[col - 1][row].rightWall = true;
                    }
                    if (right) {
                        square.rightWall = true;
                        if (col < ARR_COLS - 1) grid[col + 1][row].leftWall = true;
                    }
                } else {
                    console.warn(`Skipping square data outside grid bounds: col=${col}, row=${row}`);
                }
            });

            logOutput(`Grid "${file.name}" loaded successfully.`);
            isGridSaved = true; // Loaded grid is considered 'saved' initially
            clearError();

        } catch (error) {
            logError(`Error loading grid file "${file.name}": ${error.message}`);
            console.error("Grid loading error:", error);
        } finally {
             event.target.value = null; // Clear the input regardless of success/failure
        }
    };
    reader.onerror = function(e) {
        logError(`Error reading grid file "${file.name}": ${e.target.error}`);
        console.error("File reading error:", e.target.error);
         event.target.value = null; // Clear the input on error too
    };
    reader.readAsText(file);
}
// --- End Save and Load Functions ---

// --- Example Loading Functions ---

function populateExampleDropdown() {
    if (!exampleSelectElement || typeof EXAMPLE_CODE === 'undefined') {
        logError("Could not populate examples: Dropdown element or example data missing.");
        return;
    }

    const categories = {};
    // Group examples by category
    EXAMPLE_CODE.forEach((example, index) => {
        if (!categories[example.category]) {
            categories[example.category] = [];
        }
        // Store index along with title for easy lookup later
        categories[example.category].push({ title: example.title, index: index });
    });

    // Clear existing options except the first default one
    while (exampleSelectElement.options.length > 1) {
        exampleSelectElement.remove(1);
    }

    // Create optgroups and options
    for (const category in categories) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = category;
        categories[category].forEach(item => {
            const option = document.createElement('option');
            option.value = item.index; // Store the index as the value
            option.textContent = item.title;
            optgroup.appendChild(option);
        });
        exampleSelectElement.appendChild(optgroup);
    }
    logOutput("Example dropdown populated.");
}


function loadSelectedExample(event) {
    const selectedIndex = event.target.value;

    if (selectedIndex === "") { // "-- Select Example --" chosen
        return;
    }

    const exampleIndex = parseInt(selectedIndex, 10);
    if (isNaN(exampleIndex) || exampleIndex < 0 || exampleIndex >= EXAMPLE_CODE.length) {
        logError(`Invalid example index selected: ${selectedIndex}`);
        event.target.value = ""; // Reset dropdown
        return;
    }

    // Check for unsaved changes
    if (!isCodeSaved) {
        const proceed = confirm("Loading this example will overwrite unsaved changes in the editor. Are you sure you want to continue?");
        if (!proceed) {
            logOutput("Example load cancelled by user.");
            event.target.value = ""; // Reset dropdown
            return;
        }
    }

    const example = EXAMPLE_CODE[exampleIndex];
    document.getElementById('code-editor').value = example.code;
    logOutput(`Example "${example.title}" loaded successfully.`);
    isCodeSaved = false; // Loaded code is initially unsaved
    clearError(); // Clear any previous errors

    // Reset the dropdown back to the default option
    event.target.value = "";
}

// --- End Example Loading Functions ---

// --- Add new functions ---

function applyNewDimensions() {
    const newCols = parseInt(colsInputElement.value, 10);
    const newRows = parseInt(rowsInputElement.value, 10);

    // --- Validation ---
    if (isNaN(newCols) || isNaN(newRows) || newCols < 1 || newRows < 1 || newCols > 100 || newRows > 100) {
        logError("Invalid dimensions: Columns and Rows must be numbers between 1 and 100.");
        colsInputElement.value = ARR_COLS;
        rowsInputElement.value = ARR_ROWS;
        return;
    }

    // --- Check if dimensions actually changed ---
    if (newCols === ARR_COLS && newRows === ARR_ROWS) {
        logOutput("Dimensions haven't changed.");
        return;
    }

    // --- Confirmation ---
    let confirmationMessage = `Changing dimensions to ${newCols}x${newRows}.`;
    if (newCols < ARR_COLS || newRows < ARR_ROWS) {
        confirmationMessage += "\nShrinking the grid will remove any items (walls, balls) outside the new bounds.";
    }
    if (nikiCol >= newCols || nikiRow >= newRows) {
        confirmationMessage += `\nNiki is currently outside the new bounds and will be moved to the center.`;
    }
    if (!isGridSaved) {
        confirmationMessage += "\n\nWarning: You also have other unsaved grid changes.";
    }
    confirmationMessage += "\n\nProceed?";

    const proceed = confirm(confirmationMessage);

    if (!proceed) {
        logOutput("Dimension change cancelled by user.");
        colsInputElement.value = ARR_COLS;
        rowsInputElement.value = ARR_ROWS;
        return;
    }

    // --- Apply Changes ---
    logOutput(`Applying new dimensions: ${newCols}x${newRows}`);

    const oldCols = ARR_COLS;
    const oldRows = ARR_ROWS;
    const oldGrid = grid; // Keep a reference to the old grid data

    // Update global dimensions
    ARR_COLS = newCols;
    ARR_ROWS = newRows;

    // 1. Create the new grid structure and copy/preserve old data
    let newGrid = new Array(ARR_COLS);
    for (let i = 0; i < ARR_COLS; i++) {
        newGrid[i] = new Array(ARR_ROWS);
        for (let j = 0; j < ARR_ROWS; j++) {
            // If this cell existed in the old grid, copy its data
            if (i < oldCols && j < oldRows) {
                newGrid[i][j] = oldGrid[i][j]; // Copy the GridSquare object reference
            } else {
                // Otherwise, it's a new cell, initialize it
                newGrid[i][j] = new GridSquare();
            }
        }
    }
    grid = newGrid; // Assign the newly created grid

    // 2. Check and potentially reset Niki's position if out of new bounds
    //    Keep Niki's ball count and direction regardless.
    if (nikiCol >= ARR_COLS || nikiRow >= ARR_ROWS) {
        logWarn(`Niki was outside the new grid bounds (${nikiCol}, ${nikiRow}). Resetting position to center.`);
        nikiCol = Math.floor(ARR_COLS / 2);
        nikiRow = Math.floor(ARR_ROWS / 2);
        // Niki's direction and ball count remain unchanged
    }

    // 3. Update UI input fields
    colsInputElement.value = ARR_COLS;
    rowsInputElement.value = ARR_ROWS;

    // 4. Resize the p5.js canvas
    resizeCanvas(ARR_COLS * RECT_WIDTH, ARR_ROWS * RECT_HEIGHT);

    // 5. Perform necessary partial resets
    isExecuting = false; // Stop any code execution
    if (runButtonElement) {
        runButtonElement.disabled = false;
        runButtonElement.textContent = "Run Code";
    }
    procedures = {}; // Clear parsed procedures as they might rely on old grid state
    clearError(); // Clear any execution errors
    updateBallCounterDisplay(); // Update display (Niki's ball count shouldn't change unless repositioned, but good practice)
    isGridSaved = false; // Mark grid as modified/unsaved due to resize

    logOutput(`Grid resized to ${ARR_COLS}x${ARR_ROWS}. Content preserved within bounds.`);
}

// --- General Canvas Mouse Handlers ---

function mousePressed() {
    // Prevent interaction outside canvas or if modal is open
    if (mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height || instructionsModalElement.style.display === 'block') {
        return;
    }

    if (builderMode) {
        builderMousePressed(); // Call the function from sketch_builder.js
    } else {
        // Interaction Mode: Check for Niki drag start
        const col = Math.floor(mouseX / RECT_WIDTH);
        const row = Math.floor(mouseY / RECT_HEIGHT);
        if (col === nikiCol && row === nikiRow) {
            isDraggingNiki = true;
            // Optional: Add visual feedback for dragging start? (e.g., change cursor)
            p5Canvas.elt.style.cursor = 'grabbing'; // Change cursor
            logOutput(`Started dragging Niki from (${nikiCol}, ${nikiRow})`);
        }
    }
     // Prevent default browser drag behavior if needed
     // return false;
}

function mouseDragged() {
     // Prevent interaction outside canvas or if modal is open
    if (mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height || instructionsModalElement.style.display === 'block') {
        // If dragging started and mouse went out, maybe cancel drag?
        if (isDraggingNiki) {
             mouseReleased(); // Treat as release/cancel
        }
        return;
    }

    if (builderMode) {
        // No default drag action in builder mode yet
    } else {
        if (isDraggingNiki) {
             // No visual update during drag in this simple version,
             // Niki position updates on release.
             // We could add visual feedback here if desired (e.g., draw ghost Niki)
        }
    }
}

function mouseReleased() {
     // Always reset cursor on release
     p5Canvas.elt.style.cursor = 'default';

    // Prevent interaction outside canvas or if modal is open
    if (mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height || instructionsModalElement.style.display === 'block') {
        // If mouse was released outside while dragging, ensure dragging stops
         if (isDraggingNiki) {
            isDraggingNiki = false;
            logOutput("Niki drag cancelled (released outside).");
        }
        return;
    }

    if (builderMode) {
        // No default release action in builder mode
    } else {
        if (isDraggingNiki) {
            const targetCol = Math.floor(mouseX / RECT_WIDTH);
            const targetRow = Math.floor(mouseY / RECT_HEIGHT);

            // Check if target is within bounds and different from start
            if (targetCol >= 0 && targetCol < ARR_COLS && targetRow >= 0 && targetRow < ARR_ROWS) {
                if (targetCol !== nikiCol || targetRow !== nikiRow) {
                    nikiCol = targetCol;
                    nikiRow = targetRow;
                    isGridSaved = false; // Mark grid as modified
                    logOutput(`Niki dropped at (${nikiCol}, ${nikiRow})`);
                } else {
                     logOutput("Niki drag ended at the same spot.");
                }
            } else {
                logOutput("Niki drag ended outside valid grid area.");
            }
            isDraggingNiki = false;
        }
    }
}

function mouseClicked() {
     // Prevent interaction outside canvas or if modal is open
    if (mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height || instructionsModalElement.style.display === 'block') {
        return;
    }

    if (builderMode) {
         // Handle middle click for placing Niki
        if (mouseButton === CENTER) {
             builderMouseClicked(); // Call builder's click handler
        }
        // Builder mode left/right clicks are handled by mousePressed (previously builderMousePressed)
    } else {
        // No specific click action in interaction mode (only drag)
    }
}

// --- End General Canvas Mouse Handlers --- 