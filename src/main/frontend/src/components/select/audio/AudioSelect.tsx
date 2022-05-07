import React from 'react';
import classes from "./AudioSelect.module.css";
import AudioPreviewLooped from "../../audio/preview/AudioPreviewLooped";

const AudioSelect = () => {
    return (
        <div>

            <AudioPreviewLooped url={"/server/music/default/Sunny day.mp3"}></AudioPreviewLooped>
        </div>
    );
};

export default AudioSelect;