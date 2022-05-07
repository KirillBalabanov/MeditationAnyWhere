import React, {useRef} from 'react';
import AudioOuter from "../components/AudioOuter";
import PlayButton from "../components/PlayButton";
import {useAudio} from "../components/useAudio";
import StopButton from "../components/StopButton";
import Controls from "../components/Controls";
import Volume from "../components/Volume";
import classes from "./AudioPreviewLooped.module.css";

interface AudioPreviewLoopedProps {
    url: string
}

const AudioPreviewLooped = ({url}: AudioPreviewLoopedProps) => {
    const {isPlaying, setIsPlaying, currentTime, setCurrentTime, duration, setDuration, audioShown, setAudioShown, audioVolume, setAudioVolume, audioElement} = useAudio();

    return (
        <AudioOuter url={url} audioElement={audioElement} looped={true}>
            <Controls>
                <div className={classes.titleOuter}>
                    <div className={classes.title}>wwwwwwwwwwwwwwwwwwww</div>
                </div>
                <Volume audioShown={audioShown} setAudioShown={setAudioShown}
                        audioVolume={audioVolume} setAudioVolume={setAudioVolume} audioElement={audioElement}></Volume>
            </Controls>
        </AudioOuter>
    );
};

export default AudioPreviewLooped;