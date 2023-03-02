import React from "react";
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
import styled from "styled-components";

import settingsIcon from '../assets/settingsIcon.svg'

const SettingsButton = styled.button`
cursor: pointer;
    background-color: transparent;
    border: 0;

    /* margin-top: 5rem; */
    
`

const StyledPopup = styled(Popup)`
    &-content {
        max-width: 32rem;
        min-width: 20rem;
        background-color: #FFFFFF;
        color: #1E2240;
        border-radius: 20px;
        padding: 0;

        .text {
            font-size: 0.9rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.2rem;
        }

        .header {
            display: flex;

            h2 {
                margin: 20px 30px;
                margin-right: auto;
            }

            .close {
                cursor: pointer;
                color: #a8abb4;
                font-size: 1.3rem;
                background-color: transparent;
                border: 0;
                margin: 20px 30px;
            }
        }

        .main_content {
            padding: 20px 30px;

            .inputs {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between;
                margin: 15px 0;

                .input {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    label {
                        color: #a8abb4;
                        font-size: 0.7rem;
                        font-weight: 500;
                    }

                    input {
                        width: 8rem;
                        background-color: #dee2ed;
                        color: #1E2240;
                        font-weight: 600;

                        border: 0;
                        border-radius: 5px;
                        outline: 0;
                        padding: 10px;
                        margin-top: 5px;
                    }
                }
            }
            
        }

        @media (min-width: 950px) {
            .inputs {
                display: flex;
                flex-direction: row !important;

                .input {
                    flex-direction: column;
                }
            }
        }
    }
`

function Settings() {
    return (
        <StyledPopup trigger={<SettingsButton><img src={settingsIcon} alt="Settings Icon" /></SettingsButton>}
        position="center"
        modal>
            {close => (
                <>
                    <div className="header">
                    <h2>Configurações</h2>
                    <button className="close" onClick={close}>&times;</button>
                    </div>
                    <hr />
                    <div className="main_content">
                        <p className="text">Time (minutes)</p>
                        <div className="inputs">
                            <div className="input">
                                <label htmlFor="pomodoro">pomodoro</label>
                                <input type="number" name="pomodoro" id="pomodoro" defaultValue={25} />
                            </div>

                            <div className="input">
                                <label htmlFor="short_break">pausa curta</label>
                                <input type="number" name="short_break" id="short_break" defaultValue={5} />
                            </div>

                            <div className="input">
                                <label htmlFor="long_break">pausa longa</label>
                                <input type="number" name="long_break" id="long_break" defaultValue={15} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </StyledPopup>

    );
}

export default Settings;


