import classes from "./SettingsLibrary.module.css";
import Section from "../../components/SettingsContentSection";
import audioUploadIcon from "../../../../images/audioUploadIcon.svg";
import InlineAudio from "../../../audio/inline/InlineAudio";
import React, {ChangeEvent, useEffect, useState} from "react";
import FormAudio from "../../../audio/form/FormAudio";
import removeIcon from "../../../../images/removeIcon.svg";
import Loader from "../../../loader/Loader";
import Popup from "../../../popup/Popup";
import {isValidAudioName} from "../../../../util/AudioValidator/isValidAudioName";
import {useStore} from "../../../../context/CacheStore/StoreContext";
import {UserActionTypes} from "../../../../reducer/userReducer";
import {AudioFetchI, ErrorFetchI} from "../../../../types/serverTypes";
import {AudioInterface} from "../../../../types/contextTypes";
import {csrfFetching, FetchContentTypes, FetchingMethods} from "../../../../util/Fetch/csrfFetching";

interface formData {
    url: string,
    title: string,
    delete: string,
    changed: string
}

const SettingsLibrary = () => {

    const cacheStore = useStore()!;

    const [userState, userDispatcher] = cacheStore.userReducer;

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
        fetch("/users/current/audios").then((response) => response.json()).then((data: AudioFetchI[]) => {
            userDispatcher({type: UserActionTypes.SET_AUDIO, payload: data.map(el => {
                    return {url: el.audioUrl, title: el.audioTitle}
                })})
        }).catch(() => { // catch in case server return null
            userDispatcher({type: UserActionTypes.SET_AUDIO, payload: []})
        }).then(() => setIsLoading(false));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const audioPreview = (e: ChangeEvent) => {
        if(userState.audio === null) return;
        setAudioFile(null);
        setAudioErrorMsg("");
        setAudioPreviewUrl("");
        setAudioInputKey(Date.now());
        setAddAllowed(false);
        if (userState.audio.length >= 3) {
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
        let payload: AudioInterface[] = userState.audio!;
        inputs.forEach((inp) => {
            if (inp.delete === "1") {
                csrfFetching("/api/users/current/audio/delete", FetchingMethods.DELETE, FetchContentTypes.APPLICATION_JSON, JSON.stringify({"url": inp.url})).then((response) => response.json()).then((data) => {
                    if("error" in data) {
                        setAudioErrorMsg(data.error);
                        userDispatcher({type: UserActionTypes.RESET_AUDIO})
                        return;
                    }
                });
                payload = payload.filter(el => el.url !== inp.url);
            }
            else if (inp.changed === "1") {
                csrfFetching("/api/users/current/audio/update", FetchingMethods.PUT, FetchContentTypes.APPLICATION_JSON,
                    JSON.stringify({audioTitle: inp.title, audioUrl: inp.url})).then((response) => response.json()).then((data) => {
                    if("error" in data) {
                        setAudioErrorMsg(data.error);
                        return;
                    }
                });
                payload = payload.map(el => {
                    if (el.url === inp.url) {
                        el.title = inp.title;
                    }
                    return el;
                });
            }
        });
        userDispatcher({type: UserActionTypes.SET_AUDIO, payload: payload})
        setPopupContent("Library updated!");
        setShowPopup(true);
        setUpdateAllowed(false);
    }

    function addAudioSubmit(e: React.FormEvent) {
        e.preventDefault();
        if(userState.audio === null) return;
        if(audioFile === null) return;

        if(!addAllowed) return;

        if(userState.audio.length >= 3) return;

        let audioTitle = (e.currentTarget.querySelector("input[type=text]") as HTMLInputElement).value;

        if(!isValidAudioName(audioTitle)) return;
        if(userState.audio.filter((el) => el.title === audioTitle).length !== 0) {
            setInputErrorMsg("Title already taken.");
            return;
        }

        let formData = new FormData();
        formData.append("audioFile", audioFile!);
        formData.append("audioTitle", audioTitle);
        csrfFetching("/api/users/current/audio/add", FetchingMethods.POST, FetchContentTypes.MULTIPART_FORM_DATA, formData).then((response) => response.json()).then((data: AudioFetchI | ErrorFetchI) => {
            if("errorMsg" in data) {
                setAudioErrorMsg(data.errorMsg);
                return;
            }
            userDispatcher({type: UserActionTypes.SET_AUDIO, payload: [...userState.audio!, {url: data.audioUrl, title: data.audioTitle}]});
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
                                                    <InlineAudio audioUrl={audioPreviewUrl}></InlineAudio>
                                                    <button type={"button"} className={classes.removePreviewBtn}
                                                            onClick={() => {
                                                                setAudioPreviewUrl("");
                                                                setAudioInputKey(Date.now());
                                                            }}><img src={removeIcon} alt="remove"/></button>
                                                </div>

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
                                    userState.audio !== null && userState.audio.length > 0 &&
                                    <form onSubmit={updateLibrarySubmit}>
                                        {userState.audio.map(audio => <FormAudio audioUrl={audio.url}
                                                                              audioTitle={audio.title}
                                                                              key={audio.url}
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