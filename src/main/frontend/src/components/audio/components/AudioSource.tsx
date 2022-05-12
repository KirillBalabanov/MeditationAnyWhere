import React, {FC} from 'react';
import classes from "./AudioComponents.module.css";

interface AudioSourceProps {
    url: string,
    audioElement: React.RefObject<HTMLAudioElement>,
    looped?: boolean
}

const AudioSource: FC<AudioSourceProps> = React.memo(({url, audioElement, looped}) => {

    return (
        <div className={classes.audioSrc}>
            <audio preload="metadata" controls className={classes.audio} ref={audioElement} loop={looped}>
                <source src={url}/>
            </audio>
        </div>
    );
});

export default AudioSource;