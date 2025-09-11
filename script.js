const timer = document.querySelector("#time-content");

const POMODORO = 25;
const SHORT_BREAK = 5;
const LONG_BREAK = 15;

function startTimer(minutes, seconds) {
    let timerIntervalID = setInterval(() => {
        timer.textContent = `${minutes < 10 ? `0${minutes}` : minutes}: ${
            seconds < 10 ? `0${seconds}` : seconds
        }`;

        if (seconds <= 0 && minutes <= 0) {
            console.log(minutes, seconds);
            clearInterval(timerIntervalID);
        }

        if (seconds <= 0) {
            minutes -= 1;
            seconds = 60;
        }
        seconds--;
    }, 1000);
}

document.addEventListener("DOMContentLoaded", (event) => {
    let minutes = POMODORO;
    let seconds = 0;

    startTimer(minutes, seconds);
});
