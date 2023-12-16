var timer;
var seconds = 0;
var minutes = 0;
startTimer();

function startTimer() {
    // Start the timer
    timer = setInterval(updateTimer, 1000);
}

function stopTimer() {
    // Stop the timer
    clearInterval(timer);
}

function resetTimer() {
    // Reset the timer and update the display
    stopTimer();
    seconds = 0;
    minutes = 0;
    updateDisplay();
}

function updateTimer() {
    // Update the timer and display
    seconds++;
    if (seconds === 60) {
        seconds = 0;
        minutes++;
    }
    updateDisplay();
}

function updateDisplay() {
    // Update the timer display
    var timerDisplay = document.getElementById("timer");
    timerDisplay.textContent = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}