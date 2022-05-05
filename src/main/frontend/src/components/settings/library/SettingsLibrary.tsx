import classes from "./SettingsLibrary.module.css";
import Section from "../section/Section";
import audioUploadIcon from "../../../images/audioUploadIcon.svg";
import InlineAudio from "../../audio/InlineAudio";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import FormAudio from "../../audio/FormAudio";
import removeIcon from "../../../images/removeIcon.svg";
import Loader from "../../loader/Loader";
import {CsrfContext} from "../../../context/CsrfContext";
import AudioValidator from "../../../util/AudioValidator";


const SettingsLibrary = () => {
    let csrfContext = useContext(CsrfContext)!;
    const [audioFetched, setAudioFetched] = useState([{audioTitle: "", audioUrl: ""}]);
    const [isLoading, setIsLoading] = useState(true);
    const [audioPreviewUrl, setAudioPreviewUrl] = useState("");
    const [fileErrorMsg, setFileErrorMsg] = useState("");
    const [inputKey, setInputKey] = useState(Date.now());
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [inputErrorMsg, setInputErrorMsg] = useState("");

    useEffect(() => {
        fetch("/audio/get").then((json) => json.json()).then((data) => setAudioFetched(data)).catch(() => setAudioFetched([])).then(() => setIsLoading(false));
    }, []);

    const audioPreview = (e: ChangeEvent) => {
        let fileReader = new FileReader();
        // @ts-ignore
        let file = (e.target as HTMLInputElement).files[0];
        if(file == null) return;
        if (audioFetched.length >= 3) {
            setFileErrorMsg("You cannot have more than 3 tracks.");
            return;
        }
        setAudioFile(null);

        if (!file.type.match("audio.*")) {
            setInputKey(Date.now()); // reset file input
            setFileErrorMsg("Invalid type");
            return;
        }

        if(file.size > 7_000_000) {
            setInputKey(Date.now()); // reset file input
            setFileErrorMsg("Audio cannot exceed 7mb.");
            return;
        }

        fileReader.onloadend = () => {
            // @ts-ignore
            setAudioPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
        setAudioFile(file);
    };

    function formPost(e: React.FormEvent) {
        e.preventDefault();
        if(audioFile === null) { // update request
            let target = e.target;
            let index = 0;
            let inputs = [];
            while (true) {
                let obj = {title: "", url: "", delete: false, changed: false}
                // @ts-ignore
                let ct = target[index];
                if(ct === undefined) break;
                if (ct.name === "audioTitle") {
                    obj.url = ct.dataset.url;
                    obj.title = ct.value;
                    obj.changed = ct.dataset.changed;
                    index++;
                    while(true) { // find button of that form audio
                        // @ts-ignore
                        let bt = target[index];
                        if (bt.name === "deleteButton") {
                            obj.delete = bt.dataset.delete;
                            inputs.push(obj);
                            break;
                        }
                        index++;
                    }
                }
                index++;
            } // fill inputs

            inputs.forEach((inp) => {
                console.log(inp)
                let fd = new FormData();
                if (inp.delete) {
                    fd.append("url", inp.url);
                    fetch("/audio/del", {
                        method: "DELETE",
                        headers: {
                            'X-XSRF-TOKEN': csrfContext.csrfToken
                        },
                        body: fd,
                    }).then((response) => response.json()).then((data) => {
                        console.log(data);
                        setAudioFetched(audioFetched.filter((af) => af.audioUrl !== data["deleted"]));
                    });
                }
                else if (inp.changed) {
                    fd.append("url", inp.url);
                    fd.append("title", inp.title);
                    fetch("/audio/update", {
                        method: "PUT",
                        headers: {
                            'X-XSRF-TOKEN': csrfContext.csrfToken
                        },
                        body: fd,
                    }).then((response) => response.json()).then((data) => {
                        console.log(data);
                        setAudioFetched(audioFetched.map((af) => {
                            if (af.audioUrl === data.audioUrl) {
                                af.audioTitle = data.audioTitle;
                            }
                            return af;
                        }));
                    });
                }
            });
            return;
        }
        if(audioFetched.length >= 3) return;
        // @ts-ignore
        let audioTitle = e.target[2].value;
        if(!AudioValidator.isValidAudioName(audioTitle)) return;
        let formData = new FormData();
        formData.append("audio", audioFile);
        formData.append("title", audioTitle);
        fetch("/audio/add", {
            method: "POST",
            headers: {
                'X-XSRF-TOKEN': csrfContext.csrfToken
            },
            body: formData
        }).then((response) => response.json()).then((data) => setAudioFetched([...audioFetched, data]));
        setInputKey(Date.now());
        setAudioFile(null);
    }

    return (
        <Section title={"Your library"}>
            <form className={classes.form} onSubmit={formPost}>
                {
                    isLoading
                        ?
                        <Loader></Loader>
                        :
                        <div className={classes.formInner}>
                            <div className={classes.previewOuter}>
                                {
                                    audioPreviewUrl === ""
                                        ?
                                        <div>
                                            <label className={classes.input}>
                                                <img className={classes.inputImg} src={audioUploadIcon}
                                                     alt="uploadIcon"/>
                                                <p className={classes.inputText}>Add new audio file</p>
                                                <input type="file" style={{display: "none"}} onChange={audioPreview}
                                                       key={inputKey}/>
                                            </label>
                                            <p className={classes.fileError}>{fileErrorMsg}</p>
                                        </div>
                                        :
                                        <div className={classes.preview}>
                                            <InlineAudio url={audioPreviewUrl}></InlineAudio>
                                            <button type={"button"} className={classes.removePreviewBtn}
                                                    onClick={() => {
                                                        setAudioPreviewUrl("");
                                                        setInputKey(Date.now());
                                                    }}><img src={removeIcon} alt="remove"/></button>
                                            <input className={classes.previewInput} type="text"
                                                   placeholder={"Enter file name"} onChange={(e) => {
                                                if(!AudioValidator.isValidAudioName(e.target.value)) setInputErrorMsg("Invalid audio title");
                                                else setInputErrorMsg("");
                                            }}/>
                                            <p className={classes.inputError}>{inputErrorMsg}</p>
                                        </div>
                                }
                            </div>
                            {
                                audioFetched.length > 0 &&
                                audioFetched.map(audio => <FormAudio audioUrl={audio.audioUrl}
                                                                     audioTitle={audio.audioTitle}
                                                                     key={audio.audioUrl}></FormAudio>)
                            }
                            <button className={classes.submitBtn} type={"submit"}>Update library</button>
                        </div>
                }

            </form>
        </Section>
    );
};

export default SettingsLibrary;