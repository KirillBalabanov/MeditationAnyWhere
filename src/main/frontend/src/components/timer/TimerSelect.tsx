import React, {FC} from 'react';
import classes from "./Timer.module.css";
import {timerLenDefault} from "./TimerService/timerLenDefault";
import {useTimerContextReducer} from "../../context/TimerContext";
import {TimerActionTypes} from "../../reducer/timerReducer";

interface TimerSelectProps {
    children: React.ReactNode,
}

const TimerSelect: FC<TimerSelectProps> = ({children}) => {
    const [timerState, timerDispatch] = useTimerContextReducer()!;

    const selectCallback = (event: React.MouseEvent<HTMLDivElement>) => {
        if(timerState.isPlaying) return;
        let el = event.target as Element;
        if(el == null || !el.hasAttribute("timer-value")) return;
        // @ts-ignore
        let min = Number.parseInt(el.getAttribute("timer-value"));
        timerDispatch({type: TimerActionTypes.INIT_TIMER, payload: {
                minChose: min,
                timerLenDefault: timerLenDefault,
                timerValue: min * 60,
            } })
    }

    return (
        <div className={classes.timer__select} onClick={selectCallback}>
            {children}
        </div>
    );
};

export default TimerSelect;