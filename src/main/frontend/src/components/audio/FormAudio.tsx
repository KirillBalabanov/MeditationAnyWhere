import React, {useState} from 'react';
import classes from "./FormAudio.module.css";
import InlineAudio from "./InlineAudio";
import AudioValidator from "../../util/AudioValidator";

interface FormAudioProps {
    audioUrl: string,
    audioTitle: string
}


const FormAudio = ({audioUrl, audioTitle}: FormAudioProps) => {
    const [deleteAudio, setDeleteAudio] = useState(false);
    const [inputValue, setInputValue] = useState(audioTitle);
    const [errorMsg, setErrorMsg] = useState("");
    const [changed, setChanged] = useState(false);
    const fetchedTitle = audioTitle;

    return (
        <div className={classes.audio}>
            <input className={classes.audioTitle} name={"audioTitle"} value={inputValue} data-url={audioUrl} data-changed={changed}
                   onChange={(e) => {
                if(!AudioValidator.isValidAudioName(e.target.value)) setErrorMsg("Invalid audio name");
                else setErrorMsg("");
                if(e.target.value != fetchedTitle) setChanged(true);
                else setChanged(false);
                setInputValue(e.target.value)
            }}/>
            <p className={errorMsg==="" ? classes.error : classes.error + " " + classes.errorShown}>{errorMsg}</p>
            <InlineAudio url={audioUrl}></InlineAudio>
            <button type={"button"} className={deleteAudio ? classes.audioDelete + " " + classes.deleteSelected : classes.audioDelete}
                    onClick={(e) => {
                        setDeleteAudio(!deleteAudio);
                    }}
            name={"deleteButton"} data-delete={deleteAudio}>delete audio
            </button>
        </div>
    );
};

export default FormAudio;