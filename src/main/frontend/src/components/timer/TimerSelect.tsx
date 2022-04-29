import React, {FC} from 'react';

interface TimeSelectProps {
    timerValue: number,
    className: string
}

const TimerSelect = (props: TimeSelectProps) => {
    let timer_value_str = props.timerValue.toString();
    let timer_value: string = timer_value_str.padStart(2, "0") + ":00";
    return (
        <div className={props.className} timer-value={timer_value}>
            {timer_value_str}min
        </div>
    );
};

export default TimerSelect;