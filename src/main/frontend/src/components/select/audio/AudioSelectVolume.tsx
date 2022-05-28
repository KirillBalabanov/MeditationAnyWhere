import React, {FC, useEffect, useState} from 'react';
import volume from "../../../images/volume.svg";
import classes from "./AudioSelect.module.css";
import volumeMuted from "../../../images/volumeMuted.svg";

interface AudioSelectVolumeProps {
    audioElement: React.RefObject<HTMLAudioElement>
}

const AudioSelectVolume: FC<AudioSelectVolumeProps> = React.memo(({audioElement}) => {
    const [audioVolumeInPercents, setAudioVolumeInPercents] = useState(100);
    const [preMutedAudioVolume, setPreMutedAudioVolume] = useState(100);

    const [muted, setMuted] = useState(false);

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
        <div className={classes.libraryVolume} onClick={(e) => {
            e.stopPropagation();
        }}>
            <div className={classes.libraryVolumeImgOuter} onClick={() => {
                setMuted(prev => {
                    if(prev) audioElement.current!.volume = preMutedAudioVolume;
                    else {
                        setPreMutedAudioVolume(audioElement.current!.volume);
                        audioElement.current!.volume = 0
                    }

                    return !prev
                })
            }}>
                {
                    muted
                        ?
                        <img className={classes.libraryVolumeImg} src={volumeMuted} alt="volume"/>
                        :
                        <img className={classes.libraryVolumeImg} src={volume} alt="volume"/>
                }

            </div>
            <input className={classes.libraryVolumeInput} value={audioVolumeInPercents} type="range"
                   onChange={(e) => {
                       e.stopPropagation()
                       setMuted(false);
                       audioElement.current!.volume = Number(e.target.value) / 100;
                   }}
                   onTouchMove={(e) => {
                       e.stopPropagation();
                   }}
                   onMouseMove={(e) => {
                       e.stopPropagation();
                   }}/>
        </div>
    );
});

export default AudioSelectVolume;