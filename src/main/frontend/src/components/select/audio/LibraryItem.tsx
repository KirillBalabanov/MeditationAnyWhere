import React, {useEffect, useRef, useState} from 'react';
import classes from "./AudioSelect.module.css";
import AudioSource from "../../audio/components/AudioSource";
import selectedIcon from "../../../images/selectedIcon.svg";
import volume from "../../../images/volume.svg";
import volumeMuted from "../../../images/volumeMuted.svg";

interface LibraryItemProps {
    url: string,
    title: string,
}

const LibraryItem = ({url, title}: LibraryItemProps) => {
    const audioElement = useRef<HTMLAudioElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [audioVolume, setAudioVolume] = useState(100);
    const [muted, setMuted] = useState(false);

    const [err, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        fetch(url).then((resp) => {
            if(!resp.ok) {
                setErr(true);
                setErrMsg("Audio not found.");
            }

        });
    }, []);

    return (
        <div className={isPlaying ? classes.libraryItem + " " + classes.libraryItemActive : classes.libraryItem}
             onClick={(e) => {
                 if (isPlaying) audioElement.current!.pause();
                 else audioElement.current!.play();
                 setIsPlaying(!isPlaying);
             }}>
            <AudioSource url={url} audioElement={audioElement} looped={true}></AudioSource>
            <div className={classes.libraryText}>
                {
                    err
                        ?
                        <p style={{color: "red"}}>{errMsg}</p>
                        :
                        <p>{title}</p>
                }
            </div>
            <div className={classes.libraryControls} onClick={(e) => e.preventDefault()}>
                <div className={classes.libraryVolume} onClick={(e) => e.stopPropagation()}>
                    <div className={classes.libraryVolumeImg} onClick={() => {
                        if (muted) audioElement.current!.volume = audioVolume / 100;
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
                    <input className={classes.libraryVolumeInput} value={audioVolume} type="range" onChange={(e) => {
                        e.stopPropagation();
                        let vol = Number(e.target.value);
                        setMuted(false);
                        setAudioVolume(vol);
                        audioElement.current!.volume = vol / 100;
                    }} onMouseMove={(e) => {
                        e.stopPropagation();
                    }}/>
                </div>
                {
                    isPlaying
                    &&
                    <img src={selectedIcon} alt="selected"/>
                }
            </div>
        </div>
    );
};

export default LibraryItem;