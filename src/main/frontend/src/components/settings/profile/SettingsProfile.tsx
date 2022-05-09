import React, {ChangeEvent, FormEvent, useContext, useEffect, useState} from 'react';
import defaultAvatar from "../../../images/defaultAvatar.svg";
import classes from "./SettingsProfile.module.css";
import Section from "../section/Section";
import {CsrfContext} from "../../../context/CsrfContext";
import {useFetching} from "../../../hooks/useFetching";
import Loader from "../../loader/Loader";
import {HeaderContext, HeaderContextI} from "../../../context/HeaderContext";
import PopupRectangle from "../../popup/PopupRectangle";
import Popup from "../../popup/Popup";

const SettingsProfile = () => {
    const csrfContext = useContext(CsrfContext)!;
    const headerContext = useContext<HeaderContextI | null>(HeaderContext);

    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");

    const [deleteAvatar, setDeleteAvatar] = useState(false);
    const [imageUploadFailed, setImageUploadFailed] = useState(false);
    const [inputKey, setInputKey] = useState(Date.now());
    const [errorMsg, setErrorMsg] = useState("");

    const [popupShown, setPopupShown] = useState(false);
    const [data, setData] = useState({bio: "", avatarUrl: ""});
    const [isLoading, setIsLoading] = useState(true);

    const [rectangleShown, setRectangleShown] = useState(false);

    useFetching("/user/profile/settings/get", setData, setIsLoading);

    useEffect(() => {
        setBio(data.bio);
        setAvatarUrl(data.avatarUrl);
    }, [data]);

    const imagePreview = (e: ChangeEvent) => {
        let fileReader = new FileReader();
        // @ts-ignore
        let file = (e.target as HTMLInputElement).files[0];
        if(file == null) return;

        if (!file.type.match("image.*")) {
            setImageUploadFailed(true);
            setInputKey(Date.now()); // reset file input
            setErrorMsg("Invalid type");
            return;
        }

        if(file.size > 3_000_000) {
            setImageUploadFailed(true);
            setInputKey(Date.now()); // reset file input
            setErrorMsg("Image cannot exceed 3mb.");
            return;
        }

        fileReader.onloadend = () => {
            // @ts-ignore
            setAvatarUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
        setImageUploadFailed(false);
    };

    const formSubmit = (e: FormEvent) => {
        e.preventDefault();
        // @ts-ignore
        let image = e.target[0].files[0];
        // @ts-ignore
        let bioForm = e.target[2].value;
        if(image == null && bioForm === bio && !deleteAvatar) { // in case no changes but user clicked the btn.
            return;
        }

        if(bioForm == bio && deleteAvatar && avatarUrl === "") return;
        if(imageUploadFailed) return;

        let formData = new FormData();
        formData.append("bio", bioForm);
        formData.append("deleteAvatar", deleteAvatar.toString());
        formData.append("image", image);
        fetch("/user/profile/settings/update", {
            method: "PUT",
            headers: {
                'X-XSRF-TOKEN': csrfContext.csrfToken
            },
            body: formData
        }).then((response) => response.json()).then((data) => {
            setAvatarUrl(data["avatarUrl"]);
            setBio(data["bio"]);

            headerContext?.setReload(true);
            setPopupShown(true);
            setDeleteAvatar(false);
            setInputKey(Date.now()); // reset file input
        });
    }

    return (
        <div>
            {
                isLoading
                    ?
                    <Loader></Loader>
                    :
                    <div>
                        <form onSubmit={formSubmit}>
                            <Section title={"Profile image"}>
                                <label className={classes.upload} onMouseOver={() => setRectangleShown(true)} onMouseLeave={() => setRectangleShown(false)}>
                                    <img className={classes.avatar}
                                         src={avatarUrl==="" ? defaultAvatar : avatarUrl}
                                         alt="avatar"/>
                                    <PopupRectangle popupShown={rectangleShown} popupText={"change avatar"} left={40} top={250}></PopupRectangle>
                                    <input style={{display: "none"}} type={"file"} name={"image"}
                                           key={inputKey} onChange={imagePreview}/>
                                </label>
                                <p className={imageUploadFailed ? classes.uploadError + " " + classes.uploadErrorShown : classes.uploadError}>
                                    {errorMsg}
                                </p>
                                <button type={"button"} className={deleteAvatar ? classes.remove + " " + classes.removeSelected : classes.remove}
                                        onClick={() => {
                                            setDeleteAvatar(!deleteAvatar)
                                        }}>Remove photo</button>
                            </Section>
                            <div>
                                <Section title={"Bio"}>
                                    <textarea className={classes.bio} name="bio" cols={50} rows={6} defaultValue={bio} maxLength={255}></textarea>
                                </Section>
                            </div>
                            <button type={"submit"} className={classes.updateProfile}>Update profile</button>
                        </form>
                    </div>
            }
            <Popup popupInfo={"Profile updated."} shown={popupShown} setShown={setPopupShown} popupConfirm={"Ok"}></Popup>
        </div>
    );
};

export default SettingsProfile;