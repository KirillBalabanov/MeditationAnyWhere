import React, {FC, useState} from 'react';
import classes from "./AudioComponents.module.css";
import AudioSource from "./AudioSource";

interface AudioOuterProps {
    children: React.ReactNode,
    url: string,
    audioElement: React.RefObject<HTMLAudioElement>,
    looped?: boolean
}

const AudioOuter: FC<AudioOuterProps> = ({url, audioElement, looped, children}) => {
    const [errMsg, setErrMsg] = useState("");

    return (
        <div className={classes.audioOuter}>
            {
                errMsg !== ""
                    ?
                    <p style={{color: "red", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}>{errMsg}</p>
                    :
                    <div className={classes.audioInner}>
                        <AudioSource url={url} audioElement={audioElement} looped={looped} setAudioNotFoundError={setErrMsg}></AudioSource>
                        {children}
                    </div>
            }
        </div>
    );
};

export default AudioOuter;