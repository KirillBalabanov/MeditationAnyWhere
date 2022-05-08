import React, {useState} from 'react';
import classes from "./AudioComponents.module.css";
import volume from "../../../images/volume.svg";
import volumeMuted from "../../../images/volumeMuted.svg";

interface VolumeProps {
    audioShown: boolean,
    setAudioShown: (b: boolean) => void,
    audioVolume: number,
    setAudioVolume: (n: number) => void,
    audioElement: React.RefObject<HTMLAudioElement>,
}

const Volume = ({audioShown, setAudioShown, audioVolume, setAudioVolume, audioElement}: VolumeProps) => {
    const [muted, setMuted] = useState(false);
    return (
        <div className={audioShown ? classes.volumeOuter + " " + classes.volumeOuterFull : classes.volumeOuter}
             onMouseLeave={() => setAudioShown(false)}
        >
            <div className={classes.volumeImg} onMouseOver={() => setAudioShown(true)} onClick={() => {
                if(muted) audioElement.current!.volume = audioVolume / 100;
                else audioElement.current!.volume = 0
                setMuted(!muted)
            }}>
                {
                    muted
                    ?
                        <img src={volumeMuted} alt="volume"/>
                    :
                        <img src={volume} alt="volume"/>
                }

            </div>

            <input min={0} max={100} step={5} value={audioVolume} type="range"
                   className={audioShown ? classes.volume + " " + classes.volumeShown : classes.volume}
                   onChange={(e) => {
                       // @ts-ignore
                       let vol = Number(e.target.value);
                       setMuted(false);
                       setAudioVolume(vol);
                       audioElement.current!.volume = vol / 100;
                   }}
            />
        </div>
    );
};

export default Volume;