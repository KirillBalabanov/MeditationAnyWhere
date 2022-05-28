import React, {FC, SetStateAction, useEffect, useState} from 'react';
import classes from "./AudioComponents.module.css";
import AudioSource from "./AudioSource";

interface AudioOuterProps {
    children: React.ReactNode,
    audioUrl: string | null
    audioElement: React.RefObject<HTMLAudioElement>,
    looped?: boolean,
    setIsAudioPlaying: React.Dispatch<SetStateAction<boolean>>,
}

const AudioOuter: FC<AudioOuterProps> = ({audioUrl, audioElement,
                                             looped, children,
                                             setIsAudioPlaying}) => {
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        const playHandler = () => {
            setIsAudioPlaying(true);
        }

        const pauseHandler = () => {
            setIsAudioPlaying(false);
        }

        let ref = audioElement.current!;

        ref.addEventListener("play", playHandler);
        ref.addEventListener("pause", pauseHandler);

        return () => {
            ref.removeEventListener("play", playHandler);
            ref.removeEventListener("pause", pauseHandler);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={classes.audioOuter}>
            {
                errMsg !== ""
                    ?
                    <p className={classes.audioError}>{errMsg}</p>
                    :
                    <div className={classes.audioInner}>
                        <AudioSource audioUrl={audioUrl} audioElement={audioElement} looped={looped} setAudioNotFoundError={setErrMsg}></AudioSource>
                        {children}
                    </div>
            }
        </div>
    );
};

export default AudioOuter;