import { useContext, useEffect, useRef, useState } from 'react';
import { CircularProgressbar, buildStyles  } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import styled from 'styled-components'

const TimerContainer = styled.div`
    width: 300px;
    height: auto;

    .first_shadow {
        background-color: red;
        position: absolute;
        top:0;
    }

    .first_ring {
        background: linear-gradient(120deg, #141A31 30%,  #2d3158);
        /* border: 20px solid white; */
        border-radius: 50%;
        padding: 15px;

        box-shadow: 40px 40px 80px 10px #141A31, -40px -40px 80px 10px #2d3158;

        /* box-shadow: -20px -20px red; */

        z-index: 1;

        &::before {
            content: '';

            display: block;

            height: calc(100% - calc(5px * 2));
            width: calc(100% - calc(5px * 2));

            background: transparent;

            position: absolute;

            top: 5px;
            left: 5px;


            border-radius: calc(10px - 5px);

            z-index: -1;
        }

        .second_ring {
            background-color: #141A31;
            border: 9px solid #141A31;
            border-radius: 50%;

        }
    }

    .CircularProgressbar-text {
        font-weight: 700;
    }
`

function Timer({ MinutesContext }) {
    const minutesInfo = useContext(MinutesContext)

    const [ isPaused, setIsPaused ] = useState(false)
    const [ secondsLeft, setSecondsLeft ] = useState(minutesInfo.workMinutes * 60)

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

    const totalSeconds = minutesInfo.workMinutes * 60
    const percentage = Math.round(secondsLeft / totalSeconds * 100)

    const minutes = Math.floor(secondsLeft / 60)
    let seconds = secondsLeft % 60
    if (seconds < 10) seconds = `0${seconds}` 

    return (
        <TimerContainer>
                <div className="first_ring">
                    <div className="second_ring">
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
                    </div>
                </div>
        </TimerContainer>
    );
}

export default Timer;