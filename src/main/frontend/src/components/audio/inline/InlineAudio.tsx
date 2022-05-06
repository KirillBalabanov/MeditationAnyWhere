import React, {ChangeEvent, ChangeEventHandler, FormEvent, useEffect, useRef, useState} from 'react';
import classes from "./InlineAudio.module.css";
import startBtn from "../../../images/startButton.svg";
import stopBtn from "../../../images/stopButton.svg";
import volume from "../../../images/volume.svg";
import AudioFormatter from "../formatter/AudioFormatter";

interface InlineAudioProps {
    url: string
}

const InlineAudio = ({url}: InlineAudioProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioShown, setAudioShown] = useState(false);
    const [audioVolume, setAudioVolume] = useState(100);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    let audioElement = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        let dur = 0;
        audioElement.current!.addEventListener("loadedmetadata", (e) => {
            dur = audioElement.current!.duration;
            setDuration(Math.floor(dur));
        });
        audioElement.current!.addEventListener("timeupdate", (e) => {
            let currentTime = audioElement.current!.currentTime;
            if(currentTime === dur) setIsPlaying(false);
            setCurrentTime(currentTime);
        })

    }, []);



    return (
        <div className={classes.audioOuter}>
            <div>
                <audio preload="metadata" controls className={classes.audio} ref={audioElement}>
                    <source src={url}/>
                </audio>
            </div>
            <button type={"button"}
                    className={isPlaying ? classes.playBtn + " " + classes.playHide : classes.playBtn + " " + classes.playShown}
                    onClick={(e) => {
                        audioElement.current!.play();
                        setIsPlaying(true);
                    }}
            >
                <img src={startBtn} alt="start"/>
            </button>
            <button type={"button"}
                    className={isPlaying ? classes.playBtn + " " + classes.playShown : classes.playBtn + " " + classes.playHide}
                    onClick={(e) => {
                        audioElement.current!.pause();
                        setIsPlaying(false);
                    }}
            >
                <img src={stopBtn} alt="stop"/>
            </button>
            <div className={classes.controls}>
                <div className={classes.durationOuter}>
                    <p className={classes.begin}>{AudioFormatter.format(Math.floor(currentTime))}</p>
                    <input min={0} max={duration} value={currentTime} type="range" className={classes.duration} onChange={(e) => {
                        audioElement.current!.currentTime = Number(e.target.value);
                        setCurrentTime(Number.parseInt(e.target.value))
                    }}/>
                    <p className={classes.end}>{AudioFormatter.format(duration)}</p>
                </div>
                <div className={audioShown ? classes.volumeOuter + " " + classes.volumeOuterFull : classes.volumeOuter}
                     onMouseLeave={() => setAudioShown(false)}
                >
                    <img className={classes.volumeImg} src={volume} alt="volume"
                         onMouseOver={() => setAudioShown(true)}
                    />
                    <input min={0} max={100} step={5} value={audioVolume} type="range"
                           className={audioShown ? classes.volume + " " + classes.volumeShown : classes.volume}
                           onChange={(e) => {
                               // @ts-ignore
                               let vol = Number(e.target.value);
                               setAudioVolume(vol);
                               audioElement.current!.volume = vol / 100;
                           }}
                    />
                </div>
            </div>


        </div>
    );
};

export default InlineAudio;