import React, {FC, useState} from 'react';
import classes from "./AudioComponents.module.css";
import AudioSource from "./AudioSource";

interface AudioOuterProps {
    children: React.ReactNode,
    audioUrl: string | null
    audioElement: React.RefObject<HTMLAudioElement>,
    looped?: boolean
}

const AudioOuter: FC<AudioOuterProps> = ({audioUrl, audioElement, looped, children}) => {
    const [errMsg, setErrMsg] = useState("");

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