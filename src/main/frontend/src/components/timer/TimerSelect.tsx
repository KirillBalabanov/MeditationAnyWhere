import React, {FC} from 'react';
import classes from "./Timer.module.css";

interface TimerSelectProps {
    children: React.ReactNode,
    onClickCallback: (e: React.MouseEvent<HTMLDivElement>) => void
}

const TimerSelect: FC<TimerSelectProps> = ({children, onClickCallback}) => {
    return (
        <div className={classes.timer__select} onClick={onClickCallback}>
            {children}
        </div>
    );
};

export default TimerSelect;