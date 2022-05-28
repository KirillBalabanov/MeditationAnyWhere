import React, {FC, useEffect} from 'react';
import Bar from "../components/Bar";
import Volume from "../components/Volume";
import Controls from "../components/Controls";
import PlayButton from "../components/PlayButton";
import StopButton from "../components/StopButton";
import AudioOuter from "../components/AudioOuter";
import {useAudio} from "../components/useAudio";

interface InlineAudioProps {
    audioUrl: string | null,
}

const InlineAudio: FC<InlineAudioProps> = ({audioUrl}) => {
    const {isPlaying, setIsPlaying, currentTime, setCurrentTime, duration, setDuration, audioVolume, setAudioVolume, audioElement} = useAudio();

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
        <AudioOuter audioUrl={audioUrl} audioElement={audioElement} setIsAudioPlaying={setIsPlaying}>
            <PlayButton isPlaying={isPlaying} audioElement={audioElement}></PlayButton>
            <StopButton isPlaying={isPlaying} audioElement={audioElement}></StopButton>
            <Controls>
                <Bar audioElement={audioElement} currentTime={currentTime} setCurrentTime={setCurrentTime} duration={duration}></Bar>
                <Volume
                        audioVolume={audioVolume} setAudioVolume={setAudioVolume} audioElement={audioElement} setAudioVolumeInPercents={setAudioVolume}></Volume>
            </Controls>
        </AudioOuter>
    );
};

export default InlineAudio;