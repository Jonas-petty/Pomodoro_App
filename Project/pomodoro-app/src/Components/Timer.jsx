import { useEffect, useRef, useState } from 'react';
import { CircularProgressbar, buildStyles  } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import styled from 'styled-components'

const TimerContainer = styled.div`
    width: 300px;
    height: auto;

    .CircularProgressbar-text {
        font-weight: 700;
    }
`

function Timer({ value }) {
    const [ isPaused, setIsPaused ] = useState(false)
    const [ secondsLeft, setSecondsLeft ] = useState(value * 60)

    const secondsLeftRef = useRef(secondsLeft)
    const isPausedRef = useRef(isPaused)

    function tick() {
        secondsLeftRef.current--
        setSecondsLeft(secondsLeftRef.current)
    }

    useEffect(() => {

        const intervalId = setInterval(() => {
            
            if (secondsLeftRef.current === 0) {
                return () => clearInterval(intervalId)
            }

            tick()
        }, 1000);

        return () => clearInterval(intervalId)
    }, [secondsLeft, isPaused])

    const totalSeconds = value * 60
    const percentage = Math.round(secondsLeft / totalSeconds * 100)

    const minutes = Math.floor(secondsLeft / 60)
    let seconds = secondsLeft % 60
    if (seconds < 10) seconds = `0${seconds}` 

    return (
        <TimerContainer>
            <CircularProgressbar
                value={percentage}
                text={`${minutes}:${seconds}`}
                strokeWidth={3}
                styles={buildStyles({
                    textSize: "1.7rem",
                    textColor: "white",
                    pathColor: "#f57170",
                    trailColor: "transparent"
                })}
                />
        </TimerContainer>
    );
}

export default Timer;