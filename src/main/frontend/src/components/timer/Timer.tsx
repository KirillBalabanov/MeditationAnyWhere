import React, {FC} from 'react';
import classes from "./Timer.module.css";

interface TimerProps {
    timerLenCurrent: number,
    timerLenDefault: number,
    timerValue: string,
}

const Timer: FC<TimerProps> = ({timerLenCurrent, timerLenDefault, timerValue}) => {

    return (
        <div className={classes.timer__timer}>
            <svg className={classes.timer__svg} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g>
                    <circle className={classes.timer__circle} cx="50" cy="50" r="45"/>
                    <path
                        strokeDasharray={timerLenCurrent + " " + timerLenDefault} style={timerLenCurrent==0 ? {opacity: "0"} : {opacity: "100"}}
                        d="M 50, 50
                             m -45, 0
                             a 45,45 0 1,0 90,0
                             a 45,45 0 1,0 -90,0"
                    />
                </g>
            </svg>
            <p>{timerValue}</p>
        </div>
    );
};

export default Timer;