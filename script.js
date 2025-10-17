const timer = document.querySelector("#time-content");
const graph = document.querySelector("#graph");
const statusList = [...document.querySelectorAll(".status")];

let currentTime = localStorage.getItem("currentTime");
if (!currentTime) {
    localStorage.setItem(
        "currentTime",
        JSON.stringify({ minutes: 0, seconds: 0 })
    );
    currentTime = localStorage.getItem("currentTime");
}
currentTime = JSON.parse(currentTime);

let pomodoro = 25;
let shortBreak = 5;
let longBreak = 15;
let isPaused = false;
let controller = null;
const timerAudio = new Audio("./assets/timer_sound.wav");
const clickAudio = new Audio("./assets/click_sound.mp3");

let cycles = Number(localStorage.getItem("cycles") || 0);
let phase = localStorage.getItem("phase") || "pomodoro";

function getPhaseTotalSeconds(phase) {
    if (phase === "pomodoro") return pomodoro * 60;
    if (phase === "short-break") return shortBreak * 60;
    return longBreak * 60;
}

function updateGraph(phase, minutes, seconds) {
    const total = getPhaseTotalSeconds(phase);
    const remaining = minutes * 60 + seconds;
    const elapsed = Math.max(0, total - remaining);
    let percentage = Math.round((elapsed / total) * 100);
    percentage = Math.max(0, Math.min(100, percentage));
    const p = percentage === 0 ? 0.001 : percentage;
    graph.style.backgroundImage = `conic-gradient(var(--scent-color) 0% ${p}%, transparent ${p}% 100%)`;
}

function updateActiveStatus() {
    statusList.forEach((status) => {
        status.classList.toggle("active", status.classList.contains(phase));
    });
}

async function startTimer(minutes = 0, seconds = 0, signal) {
    updateActiveStatus();

    return new Promise((resolve) => {
        updateGraph(phase, minutes, seconds);
        let timerIntervalID = setInterval(() => {
            if (signal?.aborted) {
                localStorage.setItem(
                    "currentTime",
                    JSON.stringify({ minutes, seconds })
                );
                console.log(minutes, seconds);
                clearInterval(timerIntervalID);
                resolve("paused");
                return;
            }

            let timeContent = `${minutes < 10 ? `0${minutes}` : minutes}:${
                seconds < 10 ? `0${seconds}` : seconds
            }`;

            timer.textContent = timeContent;
            document.title = `Pomodoro - ${timeContent}`;

            if (timer.textContent == "00:00") {
                pauseTimer();
                timerAudio.play();
            }
            updateGraph(phase, minutes, seconds);

            if (seconds <= 0 && minutes <= 0) {
                clearInterval(timerIntervalID);
                localStorage.setItem(
                    "currentTime",
                    JSON.stringify({ minutes: 0, seconds: 0 })
                );
                resolve("done");
                return;
            }

            if (seconds <= 0) {
                minutes -= 1;
                seconds = 60;
            }
            seconds--;
        }, 1000);
    });
}

async function runloop() {
    while (!isPaused) {
        controller = controller ?? new AbortController();

        let ct = JSON.parse(
            localStorage.getItem("currentTime") || '{"minutes":0,"seconds":0}'
        );
        if (ct.minutes > 0 || ct.seconds > 0) {
            const rr = await startTimer(
                ct.minutes,
                ct.seconds,
                controller.signal
            );
            if (rr === "paused" || isPaused) break;

            localStorage.setItem(
                "currentTime",
                JSON.stringify({ minutes: 0, seconds: 0 })
            );
        } else {
            if (phase === "pomodoro") {
                const r1 = await startTimer(pomodoro, 0, controller.signal);
                if (r1 === "paused" || isPaused) break;
                cycles++;
                localStorage.setItem("cycles", cycles);
                phase = cycles % 4 === 0 ? "long-break" : "short-break";
                localStorage.setItem("phase", phase);
            } else if (phase === "short-break") {
                const r2 = await startTimer(shortBreak, 0, controller.signal);
                if (r2 === "paused" || isPaused) break;
                phase = "pomodoro";
                localStorage.setItem("phase", phase);
            } else {
                const r3 = await startTimer(longBreak, 0, controller.signal);
                if (r3 === "paused" || isPaused) break;
                cycles = 0;
                localStorage.setItem("cycles", cycles);
                phase = "pomodoro";
                localStorage.setItem("phase", phase);
            }
        }
    }
}

function pauseTimer() {
    isPaused = !isPaused;

    if (isPaused) {
        controller?.abort();
        controller = null;
    } else {
        controller = new AbortController();
        runloop();
    }
}

document.addEventListener("DOMContentLoaded", async (event) => {
    controller = new AbortController();
    updateGraph(phase, currentTime.minutes, currentTime.seconds);
    runloop();
});

timer.addEventListener("click", (event) => {
    clickAudio.play();
    pauseTimer();
});
