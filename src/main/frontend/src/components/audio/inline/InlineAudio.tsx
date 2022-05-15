import React, {useEffect} from 'react';
import Bar from "../components/Bar";
import Volume from "../components/Volume";
import Controls from "../components/Controls";
import PlayButton from "../components/PlayButton";
import StopButton from "../components/StopButton";
import AudioOuter from "../components/AudioOuter";
import {useAudio} from "../components/useAudio";

interface InlineAudioProps {
    url: string
}

const InlineAudio = ({url}: InlineAudioProps) => {
    const {isPlaying, setIsPlaying, currentTime, setCurrentTime, duration, setDuration, audioShown, setAudioShown, audioVolume, setAudioVolume, audioElement} = useAudio();

    useEffect(() => {
        let dur = 0;
        audioElement.current!.addEventListener("loadedmetadata", () => {
            dur = audioElement.current!.duration;
            setDuration(Math.floor(dur));
        });
        audioElement.current!.addEventListener("timeupdate", () => {
            let currentTime = audioElement.current!.currentTime;
            if(currentTime === dur) setIsPlaying(false);
            setCurrentTime(currentTime);
        })

    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <AudioOuter url={url} audioElement={audioElement}>
            <PlayButton isPlaying={isPlaying} setIsPlaying={setIsPlaying} audioElement={audioElement}></PlayButton>
            <StopButton isPlaying={isPlaying} setIsPlaying={setIsPlaying} audioElement={audioElement}></StopButton>
            <Controls>
                <Bar audioElement={audioElement} currentTime={currentTime} setCurrentTime={setCurrentTime} duration={duration}></Bar>
                <Volume audioShown={audioShown} setAudioShown={setAudioShown}
                        audioVolume={audioVolume} setAudioVolume={setAudioVolume} audioElement={audioElement}></Volume>
            </Controls>
        </AudioOuter>
    );
};

export default InlineAudio;