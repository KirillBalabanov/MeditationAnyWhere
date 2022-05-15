import React, {FC, SetStateAction} from 'react';
import classes from "./AudioComponents.module.css";

interface AudioSourceProps {
    url: string,
    audioElement: React.RefObject<HTMLAudioElement>,
    looped?: boolean,
    setAudioNotFoundError?: React.Dispatch<SetStateAction<string>>
}

const AudioSource: FC<AudioSourceProps> = React.memo(({url, audioElement, looped, setAudioNotFoundError}) => {

    return (
        <div className={classes.audioSrc}>
            <audio preload="metadata" controls className={classes.audio} ref={audioElement} loop={looped}>
                <source src={url} onError={() => setAudioNotFoundError!("Audio not found")}/>
            </audio>
        </div>
    );
});

export default AudioSource;