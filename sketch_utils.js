// --- Utility and Logging Functions ---

function logOutput(message) {
    console.log("NIKI:", message);
    // Could potentially update a status line in the UI here too
}

function logError(message) {
    console.error("NIKI ERROR:", message);
    if (!errorLogElement) { // Get element if not already cached
        errorLogElement = document.getElementById('error-log');
    }
    if (errorLogElement) {
        // Append error instead of replacing, keep existing errors visible
        errorLogElement.textContent += (errorLogElement.textContent ? '\n' : '') + message;
        errorLogElement.style.color = 'red';
    } else {
        console.error("Error log element not found in the DOM!");
    }
}

function clearError() {
    if (!errorLogElement) {
        errorLogElement = document.getElementById('error-log');
    }
     if (errorLogElement) {
        errorLogElement.textContent = ''; // Clear the text content
    }
}

function updateBallCounterDisplay() {
    if (!ballCounterElement) { // Get element if not already cached
        ballCounterElement = document.getElementById('ball-counter');
    }
    if (ballCounterElement) {
        ballCounterElement.textContent = `Niki's Balls: ${nikiNumOfBalls}`;
    } else {
         console.warn("Ball counter element not found in the DOM!");
    }
}

function handleTabInTextarea(editorElement) {
     editorElement.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            e.preventDefault(); // Prevent default tab behavior (focus change)

            const start = this.selectionStart;
            const end = this.selectionEnd;
            const tabChar = "\t";

            // Insert tab character at the cursor position
            this.value = this.value.substring(0, start) + tabChar + this.value.substring(end);

            // Move cursor position forward
            this.selectionStart = this.selectionEnd = start + tabChar.length;
        }
    });
} 