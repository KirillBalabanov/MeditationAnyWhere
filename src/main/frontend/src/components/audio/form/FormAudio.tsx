import React, {useState} from 'react';
import classes from "./FormAudio.module.css";
import InlineAudio from "../inline/InlineAudio";
import {isValidAudioName} from "../../../util/AudioValidator/isValidAudioName";

interface FormAudioProps {
    audioUrl: string,
    audioTitle: string,
    setUpdateAllowed: (b: boolean) => void,
}


const FormAudio = ({audioUrl, audioTitle, setUpdateAllowed}: FormAudioProps) => {
    const [deleteAudio, setDeleteAudio] = useState(false);
    const [changed, setChanged] = useState(false);
    const [inputValue, setInputValue] = useState(audioTitle);
    const [errorMsg, setErrorMsg] = useState("");
    const fetchedTitle = audioTitle;

    return (
        <div className={classes.audio}>
            <input className={classes.audioTitle} name={"audioTitle"} value={inputValue} maxLength={20} data-url={audioUrl} data-changed={changed ? 1 : 0}
                   onChange={(e) => {
                if(!isValidAudioName(e.target.value)) {
                    setUpdateAllowed(false);
                    setErrorMsg("Invalid audio name");
                }
                else {
                    setUpdateAllowed(true);
                    setErrorMsg("");
                }
                if(e.target.value !== fetchedTitle) setChanged(true);
                else setChanged(false);
                setInputValue(e.target.value)
            }}/>
            <p className={errorMsg==="" ? classes.error : classes.error + " " + classes.errorShown}>{errorMsg}</p>
            <div className={classes.inlineAudio}>
                <InlineAudio url={audioUrl}></InlineAudio>
            </div>
            <button style={{display: errorMsg!=="" ? "block" : "flex"}} type={"button"} className={deleteAudio ? classes.audioDelete + " " + classes.deleteSelected : classes.audioDelete}
                    onClick={() => {
                        setDeleteAudio(!deleteAudio);
                        setUpdateAllowed(true);
                    }}
            name={"deleteButton"} data-delete={deleteAudio ? 1 : 0}>delete audio
            </button>
        </div>
    );
};

export default FormAudio;