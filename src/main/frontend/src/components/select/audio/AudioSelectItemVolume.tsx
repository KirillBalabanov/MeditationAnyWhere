import React, {FC, useState} from 'react';
import classes from "./AudioSelect.module.css";
import volumeMuted from "../../../images/volumeMuted.svg";
import volume from "../../../images/volume.svg";

interface AudioSelectItemVolumeProps {
    audioElement: React.RefObject<HTMLAudioElement>,
}

const AudioSelectItemVolume: FC<AudioSelectItemVolumeProps> = ({audioElement}) => {
    const [muted, setMuted] = useState(false);
    const [currentVolumeInPercents, setCurrentVolumeInPercents] = useState(100);

    function setVolumeInPercents(vol: number) {
        setCurrentVolumeInPercents(vol);
        audioElement.current!.volume = vol / 100;
    }

    return (
        <div className={classes.libraryVolume} onClick={(e) => e.stopPropagation()}>
            <div className={classes.libraryVolumeImg} onClick={() => {
                if (muted) audioElement.current!.volume = currentVolumeInPercents / 100;
                else audioElement.current!.volume = 0;
                setMuted(!muted);
            }}>
                {
                    muted
                        ?
                        <img src={volumeMuted} alt="volume"/>
                        :
                        <img src={volume} alt="volume"/>
                }
            </div>
            <input className={classes.libraryVolumeInput} value={currentVolumeInPercents} type="range" onChange={(e) => {
                e.stopPropagation();
                let vol = Number(e.target.value);
                setMuted(false);
                setVolumeInPercents(vol);
            }} onMouseMove={(e) => {
                e.stopPropagation();
            }}/>
        </div>
    );
};

export default AudioSelectItemVolume;