import React, {FC, useContext, useEffect, useRef, useState} from 'react';
import classes from "./AudioSelect.module.css";
import AudioSource from "../../audio/components/AudioSource";
import selectedIcon from "../../../images/selectedIcon.svg";
import AudioSelectVolume from "./AudioSelectVolume";
import {AudioSelectContext} from "../../../context/AudioSelectContext";

interface AudioSelectLibraryAudioProps {
    title: string,
    url: string,
}

const AudioSelectLibraryAudio: FC<AudioSelectLibraryAudioProps> = React.memo(({url, title}) => {
    const [audioNotFoundError, setAudioNotFoundError] = useState<string | null>(null);

    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const audioElement = useRef<HTMLAudioElement | null>(null);

    const audioSelectContext = useContext(AudioSelectContext);

    useEffect(() => {
        fetch(url).then((resp) => {
            if(!resp.ok) {
                setAudioNotFoundError("Audio not found");
            }
        });
    }, [url]);

    useEffect(() => {
        const playHandler = () => {
            audioSelectContext?.setIsLibraryAudioOnPlay(true);
            audioSelectContext?.setCurrentAudioElement(audioElement.current);
            setIsAudioPlaying(true);
        }

        const pauseHandler = () => {
            audioSelectContext?.setIsLibraryAudioOnPlay(false);
            setIsAudioPlaying(false);
        }
        let ref = audioElement.current!;

        ref.addEventListener("play", playHandler);
        ref.addEventListener("pause", pauseHandler);

        return () => {
            ref.removeEventListener("play", playHandler);
            ref.removeEventListener("pause", pauseHandler);
        };
    }, [audioSelectContext]);


    const togglePlay = () => {
        if (canPlay()) {
            if (audioSelectContext?.currentAudioElement != null) {
                audioSelectContext?.currentAudioElement?.pause(); // reset played element.
                if(audioSelectContext.currentAudioElement.played) audioSelectContext.currentAudioElement.currentTime = 0;
            }
            audioElement.current?.play();
        }
        if (canPause()) {
            audioElement.current?.pause();
        }
    }

    const canPause = () => {
        if(audioElement == null) return;
        if (isAudioPlaying) {
            return true;
        }
        return false;
    };

    const canPlay = () => {
        if(audioElement == null) return;
        if(!isAudioPlaying){
            return true;
        }
        return false;
    };

    return (
        <div className={isAudioPlaying ? classes.libraryAudio + " " + classes.libraryAudioActive : classes.libraryAudio}
             onClick={togglePlay}>
            <div className={classes.libraryAudioTitle}>
                {
                    audioNotFoundError != null
                        ?
                        <p style={{color: "red"}}>{audioNotFoundError}</p>
                        :
                        <div>
                            {title}
                            <AudioSource url={url} audioElement={audioElement} looped={true}></AudioSource>
                        </div>
                }
            </div>
            <div className={classes.libraryControls} onClick={(e) => e.preventDefault()}>
                <AudioSelectVolume audioElement={audioElement}/>
                {
                    isAudioPlaying
                    &&
                    <img src={selectedIcon} alt="selected"/>
                }
            </div>
        </div>
    );
});

export default AudioSelectLibraryAudio;