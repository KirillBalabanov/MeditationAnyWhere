import React, {FC, SetStateAction} from 'react';
import classes from "./AudioComponents.module.css";

interface AudioSourceProps {
    audioUrl: string | null,
    audioElement: React.RefObject<HTMLAudioElement>,
    looped?: boolean,
    setAudioNotFoundError?: React.Dispatch<SetStateAction<string>>
}

const AudioSource: FC<AudioSourceProps> = React.memo(({audioUrl, audioElement, looped, setAudioNotFoundError}) => {
    if(audioUrl === null) setAudioNotFoundError!("Audio not found");
    return (
        <div className={classes.audioSrc}>
            <audio preload="metadata" controls className={classes.audio} ref={audioElement} loop={looped}>
                <source src={audioUrl !== null ? audioUrl : ""} onError={() => setAudioNotFoundError!("Audio not found")}/>
            </audio>
        </div>
    );
});

export default AudioSource;