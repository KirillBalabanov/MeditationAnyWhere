import React, {FC} from 'react';
import classes from "./AudioComponents.module.css";

interface ControlsProps {
    children: React.ReactNode
}
const Controls: FC<ControlsProps> = ({children}) => {
    return (
        <div className={classes.controls}>
            {children}
        </div>
    );
};

export default Controls;