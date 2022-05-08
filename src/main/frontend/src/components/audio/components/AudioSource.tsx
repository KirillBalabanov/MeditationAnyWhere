import React, {useEffect, useState} from 'react';
import classes from "./AudioComponents.module.css";

interface AudioSourceProps {
    url: string,
    audioElement: React.RefObject<HTMLAudioElement>,
    looped?: boolean
}

const AudioSource = ({url, audioElement, looped}: AudioSourceProps) => {

    return (
        <div className={classes.audioSrc}>
            <audio preload="metadata" controls className={classes.audio} ref={audioElement} loop={looped}>
                <source src={url}/>
            </audio>
        </div>
    );
};

export default AudioSource;