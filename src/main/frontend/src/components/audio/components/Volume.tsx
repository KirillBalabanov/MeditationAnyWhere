import React, {FC, SetStateAction, useEffect, useState} from 'react';
import classes from "./AudioComponents.module.css";
import volume from "../../../images/volume.svg";
import volumeMuted from "../../../images/volumeMuted.svg";

interface VolumeProps {
    audioVolume: number,
    setAudioVolume: (n: number) => void,
    audioElement: React.RefObject<HTMLAudioElement>,
    setAudioVolumeInPercents: React.Dispatch<SetStateAction<number>>,
}

const Volume: FC<VolumeProps> = React.memo(({audioVolume, setAudioVolume, audioElement, setAudioVolumeInPercents}) => {
    const [muted, setMuted] = useState(false);
    const [preMutedAudioVolume, setPreMutedAudioVolume] = useState(100);

    useEffect(() => {

        const volumeChangeHandler = () => {
            setAudioVolumeInPercents(audioElement.current!.volume * 100);
        }

        let ref = audioElement.current!;

        ref.addEventListener("volumechange", volumeChangeHandler);

        return () => {
            ref.removeEventListener("volumechange", volumeChangeHandler);
        }

    }, []);

    return (
        <div className={classes.volumeOuter + " " + classes.volumeOuterFull}
        >
            <div className={classes.volumeImg} onClick={() => {
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