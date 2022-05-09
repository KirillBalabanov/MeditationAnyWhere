import React, {useEffect, useRef, useState} from 'react';
import classes from "./AudioSelect.module.css";
import AudioSource from "../../audio/components/AudioSource";
import AudioSelectItemControls from "./AudioSelectItemControls";
import AudioSelectItemVolume from "./AudioSelectItemVolume";

interface LibraryItemProps {
    url: string,
    title: string,
    isPlayingLibrary: boolean,
    setIsPlayingLibrary: (b: boolean) => void,
    setAudioPlaying: (el: React.RefObject<HTMLAudioElement>) => void
}

const AudioSelectItem = ({url, title, isPlayingLibrary, setIsPlayingLibrary, setAudioPlaying}: LibraryItemProps) => {
    const audioElement = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    console.log("select item")
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

    function togglePlay() {
        if(isPlayingLibrary && !isPlaying) return;
        if (isPlaying) {
            stopPlay();
        }
        else {
            runPlay();
        }
    }

    function runPlay() {
        setIsPlayingLibrary(true);
        setIsPlaying(true);
        audioElement.current!.play();
        setAudioPlaying(audioElement);
    }

    function stopPlay() {
        audioElement.current!.pause();
        setIsPlayingLibrary(false);
        setIsPlaying(false);
    }

    return (
        <div className={isPlaying ? classes.libraryItem + " " + classes.libraryItemActive : classes.libraryItem}
             onClick={togglePlay}>
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
            <AudioSelectItemControls selected={isPlaying}>
                <AudioSelectItemVolume audioElement={audioElement}></AudioSelectItemVolume>
            </AudioSelectItemControls>
        </div>
    );
};

export default AudioSelectItem;