import classes from "./SettingsLibrary.module.css";
import Section from "../../components/SettingsContentSection";
import audioUploadIcon from "../../../../images/audioUploadIcon.svg";
import InlineAudio from "../../../audio/inline/InlineAudio";
import React, {ChangeEvent, useEffect, useState} from "react";
import FormAudio from "../../../audio/form/FormAudio";
import removeIcon from "../../../../images/removeIcon.svg";
import Loader from "../../../loader/Loader";
import Popup from "../../../popup/Popup";
import {useCsrfContext} from "../../../../context/CsrfContext";
import {AudioI} from "../../../../types/types";
import {isValidAudioName} from "../../../../util/AudioValidator/isValidAudioName";

interface formData {
    url: string,
    title: string,
    delete: string,
    changed: string
}

const SettingsLibrary = () => {

    let csrfContext = useCsrfContext()!;

    const [audioFetched, setAudioFetched] = useState<AudioI[] | []>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [inputErrorMsg, setInputErrorMsg] = useState("");

    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");

    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [audioErrorMsg, setAudioErrorMsg] = useState("");
    const [audioPreviewUrl, setAudioPreviewUrl] = useState("");
    const [audioInputKey, setAudioInputKey] = useState(Date.now());

    const [addAllowed, setAddAllowed] = useState(false);

    const [updateAllowed, setUpdateAllowed] = useState(false);
    const [errorUpdateMsg, setErrorUpdateMsg] = useState("");

    useEffect(() => {
        fetch("/user/audio/get").then((response) => {
            return response.json()
        }).then((data) => setAudioFetched(data)).catch(() => { // catch in case server return null
            setAudioFetched([])
        }).then(() => setIsLoading(false));
    }, []);

    const audioPreview = (e: ChangeEvent) => {
        setAudioFile(null);
        setAudioErrorMsg("");
        setAudioPreviewUrl("");
        setAudioInputKey(Date.now());
        setAddAllowed(false);
        if (audioFetched.length >= 3) {
            setAudioErrorMsg("You cannot have more than 3 tracks.");
            setAudioInputKey(Date.now());
            return;
        }

        let fileReader = new FileReader();
        // @ts-ignore
        let file = (e.target as HTMLInputElement).files[0];
        if(file == null) return;


        if (!file.type.match("audio.*")) {
            setAudioInputKey(Date.now());
            setAudioErrorMsg("Invalid type");
            return;
        }

        if(file.size > 7_000_000) {
            setAudioInputKey(Date.now()); // reset file input
            setAudioErrorMsg("Audio cannot exceed 7mb.");
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
        let titleMap = {};
        let index = 0;
        let inputs = [];
        let changed = false;
        while (true) {

            let obj: formData = {title: "", url: "", delete: "0", changed: "0"}
            // @ts-ignore
            let ct = target[index];
            if(ct === undefined) break;
            if (ct.name === "audioTitle") {
                obj.url = ct.dataset.url;
                obj.title = ct.value;
                if(!isValidAudioName(obj.title)) return;
                obj.changed = ct.dataset.changed;
                if(obj.changed === "1") changed = true;
                if (obj.title in titleMap) {
                    setAudioErrorMsg("Title already taken");
                    return;
                }
                // @ts-ignore
                titleMap[obj.title] = true;

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
                        setAudioErrorMsg(data.error);
                        return;
                    }
                    setAudioFetched(prev => prev!.filter(el => el.audioUrl !== inp.url));
                });

            }
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
                        setAudioErrorMsg(data.error);
                        return;
                    }
                    setAudioFetched(prev => prev!.map(el => {
                        if (el.audioUrl === inp.url) {
                            el.audioTitle = inp.title;
                        }
                        return el;
                    }));
                });
            }
        });
        setPopupContent("Library updated!");
        setShowPopup(true);
        setUpdateAllowed(false);
    }

    function addAudioSubmit(e: React.FormEvent) {
        e.preventDefault();

        if(audioFile === null) return;

        if(!addAllowed) return;

        if(audioFetched.length >= 3) return;

        let audioTitle = (e.currentTarget.querySelector("input[type=text]") as HTMLInputElement).value;

        if(!isValidAudioName(audioTitle)) return;
        if(audioFetched.filter((el) => el.audioTitle === audioTitle).length !== 0) {
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
                setAudioErrorMsg(data.error);
                return;
            }
            setAudioFetched([...audioFetched, data])
        });
        // reset audio preview
        setAudioInputKey(Date.now());
        setAudioPreviewUrl("");

        setPopupContent("Audio added successfully");
        setShowPopup(true);
        setAddAllowed(false);
    }

    return (
        <div>
            {
                isLoading
                    ?
                    <Loader></Loader>
                    :
                    <Section title={"Your library"}>
                        <div className={classes.library}>
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
                                                           key={audioInputKey}/>
                                                </label>
                                                <p className={classes.fileError}>{audioErrorMsg}</p>
                                            </div>
                                            :
                                            <div className={classes.preview}>
                                                <div className={classes.previewAudio}>
                                                    <InlineAudio url={audioPreviewUrl}></InlineAudio>
                                                </div>
                                                <button type={"button"} className={classes.removePreviewBtn}
                                                        onClick={() => {
                                                            setAudioPreviewUrl("");
                                                            setAudioInputKey(Date.now());
                                                        }}><img src={removeIcon} alt="remove"/></button>
                                                <input className={classes.previewInput} type="text" maxLength={20}
                                                       placeholder={"Enter file name"} onChange={(e) => {
                                                    setAddAllowed(false);
                                                    if (!isValidAudioName(e.target.value)) setInputErrorMsg("Invalid audio title");
                                                    else {
                                                        setAddAllowed(true);
                                                        setInputErrorMsg("");
                                                    }
                                                }}/>
                                                <p className={classes.inputError}>{inputErrorMsg}</p>
                                                {
                                                    addAllowed &&
                                                    <button className={classes.addBtn} type={"submit"}>Add
                                                        audio</button>
                                                }
                                            </div>
                                    }
                                </form>
                                {
                                    audioFetched.length > 0 &&
                                    <form onSubmit={updateLibrarySubmit}>
                                        {audioFetched.map(audio => <FormAudio audioUrl={audio.audioUrl}
                                                                              audioTitle={audio.audioTitle}
                                                                              key={audio.audioUrl}
                                                                              setUpdateAllowed={setUpdateAllowed}></FormAudio>)}
                                        {
                                            updateAllowed &&
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
                        </div>
                        <Popup popupInfo={popupContent} shown={showPopup} setShown={setShowPopup}
                               popupConfirm={"Ok"}></Popup>
                    </Section>
            }
        </div>
    );
};

export default SettingsLibrary;