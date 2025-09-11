const timer = document.querySelector("#time-content");

let pomodoro = 10;
let shortBreak = 2;
let longBreak = 5;

async function startTimer(minutes = 0, seconds = 0) {
    return new Promise((resolve) => {
        let timerIntervalID = setInterval(() => {
            timer.textContent = `${minutes < 10 ? `0${minutes}` : minutes}: ${
                seconds < 10 ? `0${seconds}` : seconds
            }`;

            if (seconds <= 0 && minutes <= 0) {
                clearInterval(timerIntervalID);
                resolve();
            }

            if (seconds <= 0) {
                minutes -= 1;
                seconds = 60;
            }
            seconds--;
        }, 1000);
    });
}

document.addEventListener("DOMContentLoaded", async (event) => {
    let cycles = 0;
    let isPaused = false;

    while (!isPaused) {
        await startTimer(pomodoro, 0);
        cycles++;

        if (cycles % 4 === 0) {
            await startTimer(longBreak, 0);
        } else {
            await startTimer(shortBreak, 0);
        }
    }
});

// start pomodoro = 25
// to pomodoro == 0
// to shot break = 5
// repeat 4x
// to long break = 15
