import classes from "./SettingsLibrary.module.css";
import Section from "../section/Section";
import audioUploadIcon from "../../../images/audioUploadIcon.svg";
import InlineAudio from "../../audio/InlineAudio";
import React, {ChangeEvent, MouseEventHandler, useState} from "react";
import FormAudio from "../../audio/FormAudio";
import removeIcon from "../../../images/removeIcon.svg";


const SettingsLibrary = () => {
    const [audioFetched, setAudioFetched] = useState([
        {audioUrl: "some", audioTitle: "sdfkj"},
        {audioUrl: "somes", audioTitle: "sdfkj"},
    ])
    const [audioPreviewUrl, setAudioPreviewUrl] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [inputKey, setInputKey] = useState(Date.now());
    const [isUploadFailed, setIsUploadFailed] = useState(false);

    const audioPreview = (e: ChangeEvent) => {
        let fileReader = new FileReader();
        // @ts-ignore
        let file = (e.target as HTMLInputElement).files[0];
        if(file == null) return;

        if (!file.type.match("audio.*")) {
            setIsUploadFailed(true);
            setInputKey(Date.now()); // reset file input
            setErrorMsg("Invalid type");
            return;
        }

        if(file.size > 7_000_000) {
            setIsUploadFailed(true);
            setInputKey(Date.now()); // reset file input
            setErrorMsg("Audio cannot exceed 7mb.");
            return;
        }

        fileReader.onloadend = () => {
            // @ts-ignore
            setAudioPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
        setIsUploadFailed(false);
    };


    return (
        <Section title={"Your library"}>
            <form>
                <div className={classes.previewOuter}>
                    {
                        audioPreviewUrl === ""
                            ?
                            <div>
                                <label className={classes.input}>
                                    <img className={classes.inputImg} src={audioUploadIcon} alt="uploadIcon"/>
                                    <p className={classes.inputText}>Add new audio file</p>
                                    <input type="file" style={{display: "none"}} onChange={audioPreview}
                                           key={inputKey}/>
                                </label>
                                <p className={classes.inputError}>{errorMsg}</p>
                            </div>
                            :
                            <div className={classes.preview}>
                                <InlineAudio url={audioPreviewUrl}></InlineAudio>
                                <button type={"button"} className={classes.removePreviewBtn} onClick={() => {
                                    setAudioPreviewUrl("");
                                    setInputKey(Date.now());
                                }}><img src={removeIcon} alt="remove"/></button>
                            </div>
                    }
                </div>
                {
                    audioFetched.map((audio) => <FormAudio audioUrl={audio.audioUrl} audioTitle={audio.audioTitle}></FormAudio>)
                }
                <button className={classes.submitBtn} type={"submit"}>Update library</button>
            </form>
        </Section>
    );
};

export default SettingsLibrary;