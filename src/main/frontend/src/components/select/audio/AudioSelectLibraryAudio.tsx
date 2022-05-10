import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import classes from "./AudioSelect.module.css";
import AudioSource from "../../audio/components/AudioSource";
import selectedIcon from "../../../images/selectedIcon.svg";
import AudioSelectVolume from "./AudioSelectVolume";

interface AudioSelectLibraryAudioProps {
    title: string,
    url: string,
}

const AudioSelectLibraryAudio: FC<AudioSelectLibraryAudioProps> = React.memo(({url, title}) => {
    const [audioNotFoundError, setAudioNotFoundError] = useState<string | null>(null);

    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const audioElement = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        fetch(url).then((resp) => {
            if(!resp.ok) {
                setAudioNotFoundError("Audio not found");
            }
        });
    }, []);

    const togglePlay = () => {
        if(audioNotFoundError != null) return;
        setIsAudioPlaying(!isAudioPlaying);
    }


    return (
        <div className={isAudioPlaying ? classes.libraryAudio + " " + classes.libraryAudioActive : classes.libraryAudio}
             onClick={togglePlay}>
            <AudioSource url={url} audioElement={audioElement} looped={true}></AudioSource>
            <div className={classes.libraryAudioTitle}>
                {
                    audioNotFoundError != null
                        ?
                        <p style={{color: "red"}}>{audioNotFoundError}</p>
                        :
                        <p>{title}</p>
                }
            </div>
            <div className={classes.libraryControls} onClick={(e) => e.preventDefault()}>
                <AudioSelectVolume/>
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