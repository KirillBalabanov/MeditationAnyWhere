import React, {FC} from 'react';
import btnStop from "../../images/stopIcon.svg";
import btnStart from "../../images/startIcon.svg";

import classes from "./Timer.module.css";
import {useTimerContextReducer} from "../../context/TimerContext";
import {TimerActionTypes} from "../../reducer/timerReducer";

const TimerButton: FC = () => {
    const [timerState, timerDispatch] = useTimerContextReducer()!;
    const toggleTimer = () => {
        if(timerState.timerValue === 0) return;

        timerDispatch({type: TimerActionTypes.TOGGLE})
    }

    return (
        <div className={classes.timer__btn} onClick={toggleTimer}>
            {
                timerState.isPlaying
                    ?
                    <img src={btnStop} alt="stop"/>
                    :
                    <img src={btnStart} alt="start"/>
            }

        </div>
    );
};

export default TimerButton;