import React, {FC} from 'react';
import classes from "./AudioComponents.module.css";
import startBtn from "../../../images/startButton.svg";

export interface ButtonProps {
    isPlaying: boolean,
    audioElement: React.RefObject<HTMLAudioElement>
}

const PlayButton: FC<ButtonProps> = React.memo(({isPlaying, audioElement}) => {
    return (
        <button type={"button"}
                className={isPlaying ? classes.playBtn + " " + classes.playHide : classes.playBtn + " " + classes.playShown}
        >
            <img src={startBtn} alt="start" className={classes.playBtnImg}  onClick={() => {
                audioElement.current!.play();
            }}/>
        </button>
    );
});

export default PlayButton;