import React, {FC} from 'react';
import classes from "./Timer.module.css";
import {useTimerContext} from "../../context/TimerContext";
import {timerLenDefault} from "./TimerService/timerLenDefault";

interface TimerSelectProps {
    children: React.ReactNode,
}

const TimerSelect: FC<TimerSelectProps> = ({children}) => {
    const timerContext = useTimerContext();

    const selectCallback = (event: React.MouseEvent<HTMLDivElement>) => {
        if(timerContext?.isPlaying) return;
        let el = event.target as Element;
        if(el == null || !el.hasAttribute("timer-value")) return;
        // @ts-ignore
        let min = Number.parseInt(el.getAttribute("timer-value"));
        timerContext?.setMinListened(min);
        timerContext?.setTimerLenCurrent(timerLenDefault);
        timerContext?.setTimerValue(min * 60);
    }

    return (
        <div className={classes.timer__select} onClick={selectCallback}>
            {children}
        </div>
    );
};

export default TimerSelect;