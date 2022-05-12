import React, {FC} from 'react';
import classes from "./AudioComponents.module.css";
import startBtn from "../../../images/startButton.svg";

export interface ButtonProps {
    isPlaying: boolean,
    setIsPlaying: (b: boolean) => void,
    audioElement: React.RefObject<HTMLAudioElement>
}

const PlayButton: FC<ButtonProps> = React.memo(({isPlaying, setIsPlaying, audioElement}) => {
    return (
        <button type={"button"}
                className={isPlaying ? classes.playBtn + " " + classes.playHide : classes.playBtn + " " + classes.playShown}
                onClick={() => {
                    audioElement.current!.play();
                    setIsPlaying(true);
                }}
        >
            <img src={startBtn} alt="start"/>
        </button>
    );
});

export default PlayButton;