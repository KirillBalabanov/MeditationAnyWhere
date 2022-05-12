import React, {FC} from 'react';
import classes from "./AudioComponents.module.css";
import stopBtn from "../../../images/stopButton.svg";
import {ButtonProps} from "./PlayButton";

const StopButton: FC<ButtonProps> = ({isPlaying, setIsPlaying, audioElement}: ButtonProps) => {
    return (
        <button type={"button"}
                className={isPlaying ? classes.playBtn + " " + classes.playShown : classes.playBtn + " " + classes.playHide}
                onClick={() => {
                    audioElement.current!.pause();
                    setIsPlaying(false);
                }}
        >
            <img src={stopBtn} alt="stop"/>
        </button>
    );
};

export default StopButton;