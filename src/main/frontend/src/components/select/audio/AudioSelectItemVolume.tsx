import React, {FC, useEffect, useState} from 'react';
import classes from "./AudioSelect.module.css";
import volumeMuted from "../../../images/volumeMuted.svg";
import volume from "../../../images/volume.svg";

interface AudioSelectItemVolumeProps {
    audioElement: React.RefObject<HTMLAudioElement>,
    setAudioDataCallback?: (decrementByPercent: (decrement: number) => void) => void
}

const AudioSelectItemVolume: FC<AudioSelectItemVolumeProps> = ({audioElement, setAudioDataCallback}) => {
    const [muted, setMuted] = useState(false);
    const [currentVolumeInPercents, setCurrentVolumeInPercents] = useState(100);

    useEffect(() => {
        if(setAudioDataCallback != undefined) setAudioDataCallback(decrementVolumeByPercent);
    }, []);

    function setVolumeInPercents(vol: number) {
        setCurrentVolumeInPercents(vol);
        audioElement.current!.volume = vol / 100;
    }

    function decrementVolumeByPercent(dec: number) {
        let volume = audioElement.current!.volume * 100;
        if (volume < dec) {
            setCurrentVolumeInPercents(0);
            return;
        }
        setCurrentVolumeInPercents(volume - dec);
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