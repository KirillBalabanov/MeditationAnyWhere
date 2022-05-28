import React, {FC} from 'react';
import classes from "./AudioComponents.module.css";
import stopBtn from "../../../images/stopButton.svg";
import {ButtonProps} from "./PlayButton";

const StopButton: FC<ButtonProps> = ({isPlaying, audioElement}: ButtonProps) => {
    return (
        <button type={"button"}
                className={isPlaying ? classes.playBtn + " " + classes.playShown : classes.playBtn + " " + classes.playHide}
        >
            <img src={stopBtn} alt="stop" className={classes.playBtnImg} onClick={() => {
                audioElement.current!.pause();
            }}/>
        </button>
    );
};

export default StopButton;