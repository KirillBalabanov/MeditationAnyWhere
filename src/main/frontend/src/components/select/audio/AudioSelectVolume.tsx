import React, {FC, useEffect, useState} from 'react';
import volume from "../../../images/volume.svg";
import classes from "./AudioSelect.module.css";

interface AudioSelectVolumeProps {
    audioElement: React.RefObject<HTMLAudioElement>
}

const AudioSelectVolume: FC<AudioSelectVolumeProps> = React.memo(({audioElement}) => {
    const [audioVolumeInPercents, setAudioVolumeInPercents] = useState(100);

    useEffect(() => {
        const volumeChangeHandler = () => {
            setAudioVolumeInPercents(audioElement.current!.volume * 100);
        }

        let ref = audioElement.current!;

        ref.addEventListener("volumechange", volumeChangeHandler);

        return () => {
            ref.removeEventListener("volumechange", volumeChangeHandler);
        };
    }, [audioElement]);

    return (
        <div className={classes.libraryVolume} onClick={(e) => e.stopPropagation()}>
            <div className={classes.libraryVolumeImg} onClick={() => {}}>

            <img src={volume} alt="volume"/>

            </div>
            <input className={classes.libraryVolumeInput} value={audioVolumeInPercents} type="range"
                   onChange={(e) => {
                       e.stopPropagation()
                       audioElement.current!.volume = Number(e.target.value) / 100;
                   }}

                   onMouseMove={(e) => {
                       e.stopPropagation();
                   }}/>
        </div>
    );
});

export default AudioSelectVolume;