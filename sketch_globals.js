// --- Global Variables & Constants ---

// Grid dimensions (Changable via UI)
let ARR_COLS = 10;
let ARR_ROWS = 10;

// Visuals
const RECT_WIDTH = 32;
const RECT_HEIGHT = 32;

// Niki's state
let nikiCol, nikiRow, nikiDirection, nikiNumOfBalls;
let nikiUp, nikiRight, nikiDown, nikiLeft; // p5 image objects

// Grid state
let grid; // 2D array of GridSquare objects

// Interpreter state
let parser; // Peggy parser instance
let procedures = {}; // Store parsed procedures
let isExecuting = false; // Flag for interpreter execution
let commandsPerSecond = 10; // Default execution speed

// UI Elements (Initialized in setup)
let runButtonElement;
let speedSliderElement;
let errorLogElement;
let ballCounterElement;
let speedLabelElement;

// Builder Mode
let builderMode = true; // Default to builder mode enabled
let isDraggingNiki = false;