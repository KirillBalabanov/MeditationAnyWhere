import React, {FC} from 'react';
import classes from "./Timer.module.css";

interface TimerSelectItemProps {
    timerValue: number,
}

const TimerSelectItem: FC<TimerSelectItemProps> = React.memo(({timerValue}) => {

    return (
        <div className={classes.timer__select_item} timer-value={timerValue}>
            {timerValue}min
        </div>
    );
});

export default TimerSelectItem;