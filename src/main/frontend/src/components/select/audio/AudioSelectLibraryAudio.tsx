import React, {FC, useEffect, useRef, useState} from 'react';
import classes from "./AudioSelect.module.css";
import AudioSource from "../../audio/components/AudioSource";
import selectedIcon from "../../../images/selectedIcon.svg";
import AudioSelectVolume from "./AudioSelectVolume";
import {useAudioSelectContext} from "../../../context/AudioSelectContext";

interface AudioSelectLibraryAudioProps {
    title: string,
    url: string,
}

const AudioSelectLibraryAudio: FC<AudioSelectLibraryAudioProps> = ({url, title}) => {
    const [audioNotFoundError, setAudioNotFoundError] = useState<string>("");

    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const audioElement = useRef<HTMLAudioElement | null>(null);

    const audioSelectContext = useAudioSelectContext();

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
        if (!isAudioPlaying) {
            if (audioSelectContext?.currentAudioElement != null) { // reset previously played element.
                audioSelectContext?.currentAudioElement?.pause();
                if(audioSelectContext.currentAudioElement.played) audioSelectContext.currentAudioElement.currentTime = 0;
            }
            audioElement.current?.play();
        }
        else {
            audioElement.current?.pause();
        }
    }


    return (
        <div className={isAudioPlaying ? classes.libraryAudio + " " + classes.libraryAudioActive : classes.libraryAudio}
             onClick={togglePlay}>
            <div className={classes.libraryAudioTitle}>
                {
                    audioNotFoundError !== ""
                        ?
                        <p style={{color: "red"}}>{audioNotFoundError}</p>
                        :
                        <div>
                            {title}
                            <AudioSource audioUrl={url} audioElement={audioElement} looped={true} setAudioNotFoundError={setAudioNotFoundError}></AudioSource>
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
};

export default AudioSelectLibraryAudio;