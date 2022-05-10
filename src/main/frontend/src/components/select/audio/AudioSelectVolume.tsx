import React, {FC, useState} from 'react';
import volumeMuted from "../../../images/volumeMuted.svg";
import volume from "../../../images/volume.svg";
import classes from "./AudioSelect.module.css";

interface AudioSelectVolumeProps {
    audioElement: React.RefObject<HTMLAudioElement>
}

const AudioSelectVolume: FC<AudioSelectVolumeProps> = React.memo(({audioElement}) => {
    const [isMuted, setIsMuted] = useState(false);
    const [audioVolumeInPercents, setAudioVolumeInPercents] = useState(100);

    return (
        <div className={classes.libraryVolume} onClick={(e) => e.stopPropagation()}>
            <div className={classes.libraryVolumeImg} onClick={() => {
                setIsMuted(prev => {
                    if (prev) audioElement.current!.volume = audioVolumeInPercents / 100;
                    else audioElement.current!.volume = 0;
                    return !prev;
                });
            }}>
                {
                    isMuted
                        ?
                        <img src={volumeMuted} alt="volume"/>
                        :
                        <img src={volume} alt="volume"/>
                }
            </div>
            <input className={classes.libraryVolumeInput} value={audioVolumeInPercents} type="range"
                   onChange={(e) => {
                       e.stopPropagation();
                       let vol = Number(e.target.value);
                       setIsMuted(false);
                       setAudioVolumeInPercents(vol);
                       audioElement.current!.volume = vol / 100;
                   }}

                   onMouseMove={(e) => {
                       e.stopPropagation();
                   }}/>
        </div>
    );
});

export default AudioSelectVolume;