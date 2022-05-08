import classes from "./SettingsLibrary.module.css";
import Section from "../section/Section";
import audioUploadIcon from "../../../images/audioUploadIcon.svg";
import InlineAudio from "../../audio/inline/InlineAudio";
import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import FormAudio from "../../audio/form/FormAudio";
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
    const [updateAllowed, setUpdateAllowed] = useState(false);
    const [errorUpdateMsg, setErrorUpdateMsg] = useState("");

    useEffect(() => { // fetch user's audio from server
        fetch("/user/audio/get").then((json) => json.json()).then((data) => setAudioFetched(data)).catch(() => setAudioFetched([])).then(() => setIsLoading(false));
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
    };

    function updateLibrarySubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrorUpdateMsg("");
        let target = e.target;
        let titleHash = {};
        let index = 0;
        let inputs = [];
        let changed = false;
        while (true) {
            let obj = {title: "", url: "", delete: "0", changed: "0"}
            // @ts-ignore
            let ct = target[index];
            if(ct === undefined) break;
            if (ct.name === "audioTitle") {
                obj.url = ct.dataset.url;
                obj.title = ct.value;
                if(!AudioValidator.isValidAudioName(obj.title)) return;
                obj.changed = ct.dataset.changed;
                if(obj.changed === "1") changed = true;
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
                        if(obj.delete === "1") changed = true;
                        inputs.push(obj);
                        break;
                    }
                    index++;
                }
            }
            index++;
        } // fill inputs
        if(!changed) {
            setErrorUpdateMsg("Please make some changes first.");
            return;
        }

        let audioChanged: any = []
        inputs.forEach((inp) => {
            if (inp.delete === "1") {
                fetch("/user/audio/del", {
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
            else audioChanged = [...audioChanged, {audioUrl: inp.url, audioTitle: inp.title}]
            if (inp.changed === "1") {
                fetch("/user/audio/update", {
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
        setAudioFetched(audioChanged);
        setPopupContent("Library updated!");
        setShowPopup(true);
    }

    function addAudioSubmit(e: React.FormEvent) {
        e.preventDefault();
        if(audioFile == null) return;

        if(!addAllowed) return;

        if(audioFetched.length >= 3) return;
        // @ts-ignore
        let audioTitle = e.target[5].value;

        if(!AudioValidator.isValidAudioName(audioTitle)) return;
        if(audioFetched.filter((el) => el.audioTitle === audioTitle).length != 0) {
            setInputErrorMsg("Title already taken.");
            return;
        }

        let formData = new FormData();
        formData.append("audio", audioFile!);
        formData.append("title", audioTitle);
        fetch("/user/audio/add", {
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
                                            <div className={classes.previewAudio}>
                                                <InlineAudio url={audioPreviewUrl}></InlineAudio>
                                            </div>
                                            <button type={"button"} className={classes.removePreviewBtn}
                                                    onClick={() => {
                                                        setAudioPreviewUrl("");
                                                        setInputKey(Date.now());
                                                    }}><img src={removeIcon} alt="remove"/></button>
                                            <input className={classes.previewInput} type="text" maxLength={20}
                                                   placeholder={"Enter file name"} onChange={(e) => {
                                                       setAddAllowed(false);
                                                if(!AudioValidator.isValidAudioName(e.target.value)) setInputErrorMsg("Invalid audio title");
                                                else{
                                                    setAddAllowed(true);
                                                    setInputErrorMsg("");
                                                }
                                            }}/>
                                            <p className={classes.inputError}>{inputErrorMsg}</p>
                                            {
                                                addAllowed&&
                                                <button className={classes.addBtn} type={"submit"}>Add audio</button>
                                            }
                                        </div>
                                }
                            </form>
                            {
                                audioFetched.length > 0 &&
                                <form onSubmit={updateLibrarySubmit}>
                                    {audioFetched.map(audio => <FormAudio audioUrl={audio.audioUrl}
                                                                     audioTitle={audio.audioTitle}
                                                                     key={audio.audioUrl} setUpdateAllowed={setUpdateAllowed}></FormAudio>) }
                                    {
                                        updateAllowed&&
                                        <div>
                                            <button className={classes.updateBtn} type={"submit"}>
                                                Update library
                                            </button>
                                            <p className={classes.updateError}>{errorUpdateMsg}</p>
                                        </div>

                                    }

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