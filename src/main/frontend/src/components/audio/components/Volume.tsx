import React, {FC, useState} from 'react';
import classes from "./AudioComponents.module.css";
import volume from "../../../images/volume.svg";
import volumeMuted from "../../../images/volumeMuted.svg";

interface VolumeProps {
    audioVolume: number,
    setAudioVolume: (n: number) => void,
    audioElement: React.RefObject<HTMLAudioElement>,
}

const Volume: FC<VolumeProps> = React.memo(({audioVolume, setAudioVolume, audioElement}) => {
    const [muted, setMuted] = useState(false);
    return (
        <div className={classes.volumeOuter + " " + classes.volumeOuterFull}
        >
            <div className={classes.volumeImg} onClick={() => {
                setMuted(prev => {
                    if(muted) audioElement.current!.volume = audioVolume / 100;
                    else audioElement.current!.volume = 0

                    return !prev
                })
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
                   className={classes.volume + " " + classes.volumeShown}
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
});

export default Volume;