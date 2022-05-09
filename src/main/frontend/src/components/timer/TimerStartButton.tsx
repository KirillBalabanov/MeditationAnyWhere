import React, {FC} from 'react';
import classes from "./Timer.module.css";
import btnStop from "../../images/stopIcon.svg";
import btnStart from "../../images/startIcon.svg";

interface TimerStartButtonProps {
    toggleTimerCallback: () => void,
    isPlayingState: boolean
}

const TimerStartButton: FC<TimerStartButtonProps> = ({toggleTimerCallback, isPlayingState}) => {
    return (
        <div className={classes.timer__btn} onClick={toggleTimerCallback}>
            {
                isPlayingState
                    ?
                    <img src={btnStop} alt="stop"/>
                    :
                    <img src={btnStart} alt="start"/>
            }

        </div>
    );
};

export default TimerStartButton;