import React from 'react';
import classes from "./InlineAudio.module.css";
import startButton from "../../images/startButton.svg";
import stopButton  from "../../images/stopButton.svg";

interface InlineAudio {
    title: string,
    url: string
}

const InlineAudio = ({title, url}: InlineAudio) => {
    return (
        <div className={classes.audioOuter}>
            <p className={classes.audioTitle}>{title}</p>
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