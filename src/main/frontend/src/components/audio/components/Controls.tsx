import React from 'react';
import classes from "./AudioComponents.module.css";

interface ControlsProps {
    children: React.ReactNode
}
const Controls = ({children}: ControlsProps) => {
    return (
        <div className={classes.controls}>
            {children}
        </div>
    );
};

export default Controls;