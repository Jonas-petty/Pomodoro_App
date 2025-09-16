const timer = document.querySelector("#time-content");
let statusList = document.querySelectorAll(".status");
statusList = [...statusList];
console.log(statusList);

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

let cycles = Number(localStorage.getItem("cycles") || 0);
let phase = localStorage.getItem("phase") || "pomodoro";

function updateActiveStatus() {
    statusList.forEach((status) => {
        if (status.classList.contains("active"))
            status.classList.remove("active");

        if (status.classList.contains(phase)) {
            status.classList.add("active");
        }
    });
}

async function startTimer(minutes = 0, seconds = 0, signal) {
    updateActiveStatus();

    return new Promise((resolve) => {
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

            timer.textContent = `${minutes < 10 ? `0${minutes}` : minutes}: ${
                seconds < 10 ? `0${seconds}` : seconds
            }`;

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
        }, 1);
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

document.addEventListener("DOMContentLoaded", async (event) => {
    controller = new AbortController();
    runloop();
});

timer.addEventListener("click", (event) => {
    isPaused = !isPaused;

    if (isPaused) {
        controller?.abort();
        controller = null;
    } else {
        controller = new AbortController();
        runloop();
    }
});
