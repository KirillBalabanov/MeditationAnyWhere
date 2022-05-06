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
import Popup from "../../popup/Popup";


const SettingsLibrary = () => {
    let csrfContext = useContext(CsrfContext)!;
    const [audioFetched, setAudioFetched] = useState([{audioTitle: "", audioUrl: ""}]);
    const [isLoading, setIsLoading] = useState(true);

    const [inputErrorMsg, setInputErrorMsg] = useState("");

    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");

    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [fileErrorMsg, setFileErrorMsg] = useState("");
    const [audioPreviewUrl, setAudioPreviewUrl] = useState("");
    const [inputKey, setInputKey] = useState(Date.now());

    const [addAllowed, setAddAllowed] = useState(false);

    useEffect(() => { // fetch user's audio from server
        fetch("/audio/get").then((json) => json.json()).then((data) => setAudioFetched(data)).catch(() => setAudioFetched([])).then(() => setIsLoading(false));
    }, []);

    const audioPreview = (e: ChangeEvent) => {
        setAudioFile(null);
        setFileErrorMsg("");
        setAudioPreviewUrl("");
        setInputKey(Date.now());
        setAddAllowed(false);

        if (audioFetched.length >= 3) {
            setFileErrorMsg("You cannot have more than 3 tracks.");
            setInputKey(Date.now());
            return;
        }

        let fileReader = new FileReader();
        // @ts-ignore
        let file = (e.target as HTMLInputElement).files[0];
        if(file == null) return;


        if (!file.type.match("audio.*")) {
            setInputKey(Date.now());
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
        setAddAllowed(true);
    };

    function updateLibrarySubmit(e: React.FormEvent) {
        e.preventDefault();
        let target = e.target;
        let titleHash = {};
        let index = 0;
        let inputs = [];
        while (true) {
            let obj = {title: "", url: "", delete: "0", changed: "0"}
            // @ts-ignore
            let ct = target[index];
            if(ct === undefined) break;
            if (ct.name === "audioTitle") {
                obj.url = ct.dataset.url;
                obj.title = ct.value;
                obj.changed = ct.dataset.changed;
                if (obj.title in titleHash) {
                    setFileErrorMsg("Title already taken");
                    return;
                }
                // @ts-ignore
                titleHash[obj.title] = null;
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
        setAudioFetched([]);
        inputs.forEach((inp) => {
            if (inp.delete === "1") {
                fetch("/audio/del", {
                    method: "DELETE",
                    headers: {
                        'X-XSRF-TOKEN': csrfContext.csrfToken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({"url": inp.url})
                }).then((response) => response.json()).then((data) => {
                    if("error" in data) {
                        setFileErrorMsg(data.error);
                        return;
                    }
                });
            }
            else setAudioFetched([...audioFetched, {audioTitle: inp.title, audioUrl: inp.url}]);
            if (inp.changed === "1") {
                fetch("/audio/update", {
                    method: "PUT",
                    headers: {
                        'X-XSRF-TOKEN': csrfContext.csrfToken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({title: inp.title, url: inp.url})
                }).then((response) => response.json()).then((data) => {
                    if("error" in data) {
                        setFileErrorMsg(data.error);
                        return;
                    }
                });
            }
        });
        setPopupContent("Library updated!");
        setShowPopup(true);
    }

    function addAudioSubmit(e: React.FormEvent) {
        e.preventDefault();
        if(audioFile == null) return;

        if(!addAllowed) return;
        if(audioFetched.length >= 3) return;
        // @ts-ignore
        let audioTitle = e.target[2].value;
        if(!AudioValidator.isValidAudioName(audioTitle)) return;

        if(audioFetched.filter((el) => el.audioTitle === audioTitle).length != 0) {
            setInputErrorMsg("Title already taken.");
            return;
        }

        let formData = new FormData();
        formData.append("audio", audioFile!);
        formData.append("title", audioTitle);
        fetch("/audio/add", {
            method: "POST",
            headers: {
                'X-XSRF-TOKEN': csrfContext.csrfToken
            },
            body: formData
        }).then((response) => response.json()).then((data) => {
            if("error" in data) {
                setFileErrorMsg(data.error);
                return;
            }
            setAudioFetched([...audioFetched, data])
        });
        setInputKey(Date.now());
        setAudioPreviewUrl("");
        setAudioFile(null);
        setPopupContent("Audio added successfully");
        setShowPopup(true);
        setAddAllowed(false);
    }

    return (
        <Section title={"Your library"}>
            <div className={classes.library}>
                {
                    isLoading
                        ?
                        <Loader></Loader>
                        :
                        <div className={classes.libraryInner}>
                            <form className={classes.addForm} onSubmit={addAudioSubmit}>
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
                                            <input className={classes.previewInput} type="text" maxLength={20}
                                                   placeholder={"Enter file name"} onChange={(e) => {
                                                if(!AudioValidator.isValidAudioName(e.target.value)) setInputErrorMsg("Invalid audio title");
                                                else setInputErrorMsg("");
                                            }}/>
                                            <p className={classes.inputError}>{inputErrorMsg}</p>
                                            <button className={classes.addBtn} type={"submit"}>Add audio</button>
                                        </div>
                                }
                            </form>
                            {
                                audioFetched.length > 0 &&
                                <form onSubmit={updateLibrarySubmit}>
                                    {audioFetched.map(audio => <FormAudio audioUrl={audio.audioUrl}
                                                                     audioTitle={audio.audioTitle}
                                                                     key={audio.audioUrl}></FormAudio>)}
                                    <button className={classes.updateBtn} type={"submit"}>Update library</button>
                                </form>
                            }

                        </div>
                }
            </div>
            <Popup popupInfo={popupContent} shown={showPopup} setShown={setShowPopup} popupConfirm={"Ok"}></Popup>
        </Section>
    );
};

export default SettingsLibrary;