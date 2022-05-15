import React, {FC, useEffect, useState} from 'react';
import classes from "./AudioComponents.module.css";
import AudioSource from "./AudioSource";

interface AudioOuterProps {
    children: React.ReactNode,
    url: string,
    audioElement: React.RefObject<HTMLAudioElement>,
    looped?: boolean
}

const AudioOuter: FC<AudioOuterProps> = ({url, audioElement, looped, children}) => {
    const [err, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        fetch(url).then((resp) => {
            if(!resp.ok) {
                setErr(true);
                setErrMsg("Audio not found.");
            }

        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={classes.audioOuter}>
            {
                err
                    ?
                    <p style={{color: "red", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}>{errMsg}</p>
                    :
                    <div className={classes.audioInner}>
                        <AudioSource url={url} audioElement={audioElement} looped={looped}></AudioSource>
                        {children}
                    </div>
            }
        </div>
    );
};

export default AudioOuter;