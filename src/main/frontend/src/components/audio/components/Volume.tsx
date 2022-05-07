import React from 'react';
import classes from "./AudioComponents.module.css";
import volume from "../../../images/volume.svg";

interface VolumeProps {
    audioShown: boolean,
    setAudioShown: (b: boolean) => void,
    audioVolume: number,
    setAudioVolume: (n: number) => void,
    audioElement: React.RefObject<HTMLAudioElement>
}

const Volume = ({audioShown, setAudioShown, audioVolume, setAudioVolume, audioElement}: VolumeProps) => {
    return (
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
    );
};

export default Volume;