import React, {ChangeEvent, ChangeEventHandler, FormEvent, useState} from 'react';
import classes from "./InlineAudio.module.css";

interface InlineAudioProps {
    url: string
}

const InlineAudio = ({url}: InlineAudioProps) => {

    return (
        <div className={classes.audioOuter}>
            <div className={classes.audio}>
                <audio controls className={classes.audio}>
                    <source src={url}/>
                    <button>play</button>
                </audio>
            </div>
        </div>
    );
};

export default InlineAudio;