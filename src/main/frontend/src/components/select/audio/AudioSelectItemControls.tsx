import React, {FC} from 'react';
import classes from "./AudioSelect.module.css";
import selectedIcon from "../../../images/selectedIcon.svg";

interface AudioSelectItemControlsProps {
    children: React.ReactNode,
    selected: boolean
}

const AudioSelectItemControls: FC<AudioSelectItemControlsProps> = ({children, selected}) => {
    return (
        <div className={classes.libraryControls} onClick={(e) => e.preventDefault()}>
            {children}
            {
                selected
                &&
                <img src={selectedIcon} alt="selected"/>
            }
        </div>
    );
};

export default AudioSelectItemControls;