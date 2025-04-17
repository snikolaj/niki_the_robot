// --- Global Constants and State ---

// Playfield dimensions
const ARR_ROWS = 10;
const ARR_COLS = 15;
const RECT_WIDTH = 32;
const RECT_HEIGHT = 32;

// Niki images (initialized in preload)
let nikiUp, nikiLeft, nikiDown, nikiRight;

// Grid state (initialized in createGrid)
let grid;

// Niki state (initialized in resetNiki)
let nikiCol = 0;
let nikiRow = 0;
let nikiDirection = (1 << 30); // Start North
let nikiNumOfBalls = 0;

// Builder mode state
let builderMode = true;

// Parser and AST state
let parser; // Initialized in preload
let procedures = {}; // Initialized in runCode/resetNiki

// --- Execution Control ---
let commandsPerSecond = 10; // Default speed
let isExecuting = false;    // Flag to prevent overlaps
let runButtonElement;       // To disable/enable run button

// HTML Elements (initialized in setup/utils)
let errorLogElement;
let ballCounterElement;
let speedSliderElement;
let speedLabelElement; 