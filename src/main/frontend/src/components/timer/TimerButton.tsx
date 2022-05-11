import React, {FC, useCallback, useContext, useEffect} from 'react';
import btnStop from "../../images/stopIcon.svg";
import btnStart from "../../images/startIcon.svg";
import {TimerContext} from "../../context/TimerContext";

import classes from "./Timer.module.css";

const TimerButton: FC = React.memo(() => {
    const timerContext = useContext(TimerContext);

    const toggleTimer = useCallback(() => {
        if(timerContext?.timerValue == 0 && !timerContext.isPlaying) return;

        timerContext?.setIsPlaying(!timerContext?.isPlaying);
    }, [timerContext?.timerValue, timerContext?.isPlaying]);

    return (
        <div className={classes.timer__btn} onClick={toggleTimer}>
            {
                timerContext?.isPlaying
                    ?
                    <img src={btnStop} alt="stop"/>
                    :
                    <img src={btnStart} alt="start"/>
            }

        </div>
    );
});

export default TimerButton;