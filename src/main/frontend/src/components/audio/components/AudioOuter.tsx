import React, {useEffect, useState} from 'react';
import classes from "./AudioComponents.module.css";
import AudioSource from "./AudioSource";
import PlayButton from "./PlayButton";
import StopButton from "./StopButton";
import Controls from "./Controls";
import Bar from "./Bar";
import Volume from "./Volume";

interface AudioOuterProps {
    children: React.ReactNode,
    url: string,
    audioElement: React.RefObject<HTMLAudioElement>,
    looped?: boolean
}

const AudioOuter = ({url, audioElement, looped, children}: AudioOuterProps) => {
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
        <div className={classes.audioOuter}>
            {
                err
                    ?
                    <p style={{color: "red", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}>{errMsg}</p>
                    :
                    <div>
                        <AudioSource url={url} audioElement={audioElement} looped={looped}></AudioSource>
                        {children}
                    </div>
            }
        </div>
    );
};

export default AudioOuter;