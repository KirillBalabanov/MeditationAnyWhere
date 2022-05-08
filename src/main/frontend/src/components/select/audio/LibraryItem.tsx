import React, {useEffect, useRef, useState} from 'react';
import classes from "./AudioSelect.module.css";
import AudioOuter from "../../audio/components/AudioOuter";
import AudioSource from "../../audio/components/AudioSource";

interface LibraryItemProps {
    url: string,
    title: string,
}

const LibraryItem = ({url, title}: LibraryItemProps) => {
    const audioElement = useRef<HTMLAudioElement>(null);

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
        <div className={classes.libraryItem}>
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
        </div>
    );
};

export default LibraryItem;