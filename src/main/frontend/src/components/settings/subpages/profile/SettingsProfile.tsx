import React, {ChangeEvent, FC, FormEvent, useEffect, useState} from 'react';
import defaultAvatar from "../../../../images/defaultAvatar.svg";
import classes from "./SettingsProfile.module.css";
import Section from "../../components/SettingsContentSection";
import {useCsrfContext} from "../../../../context/CsrfContext";
import {useFetching} from "../../../../hooks/useFetching";
import Loader from "../../../loader/Loader";
import {useHeaderContext} from "../../../../context/HeaderContext";
import PopupRectangle from "../../../popup/PopupRectangle";
import Popup from "../../../popup/Popup";
import {AbsolutePositionX, AbsolutePositionY} from "../../../../types/componentTypes";
import SettingsDelBtn from "../../components/SettingsDelBtn";
import {ErrorI, ProfileI} from "../../../../types/types";

const SettingsProfile: FC = () => {
    const csrfContext = useCsrfContext()!;
    const headerContext = useHeaderContext()!;

    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");

    const [deleteAvatar, setDeleteAvatar] = useState(false);
    const [imageUploadFailed, setImageUploadFailed] = useState(false);
    const [imageInputKey, setImageInputKey] = useState(Date.now());
    const [imageUploadErrorMsg, setImageUploadErrorMsg] = useState("");

    const [popupShown, setPopupShown] = useState(false);
    const [data, setData] = useState<ProfileI>({bio: "", avatarUrl: ""});
    const [isDataLoading, setIsDataLoading] = useState(true);

    const [rectangleShown, setRectangleShown] = useState(false);

    useFetching("/user/profile/settings/get", setIsDataLoading, setData);

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
            setImageInputKey(Date.now()); // reset file input
            setImageUploadErrorMsg("Invalid type");
            return;
        }

        if(file.size > 3_000_000) {
            setImageUploadFailed(true);
            setImageInputKey(Date.now()); // reset file input
            setImageUploadErrorMsg("Image cannot exceed 3mb.");
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

        if(bioForm === bio && deleteAvatar && avatarUrl === "") return; // del but no avatar is set
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
        }).then((response) => response.json()).then((data: ProfileI | ErrorI) => {
            if ("errorMsg" in data) {
                setImageUploadErrorMsg(data.errorMsg);
                return;
            }
            setAvatarUrl(data["avatarUrl"]);
            setBio(data["bio"]);
            headerContext?.setReload(true);
            setPopupShown(true);
            setDeleteAvatar(false);
            setImageInputKey(Date.now()); // reset file input
        });
    }

    return (
        <div>
            {
                isDataLoading
                ?
                    <Loader/>
                :
                    <div>
                        <form onSubmit={formSubmit}>
                            <Section title={"Profile image"}>
                                <label className={classes.upload} onMouseOver={() => setRectangleShown(true)} onMouseLeave={() => setRectangleShown(false)}>
                                    <img className={classes.avatar}
                                         src={avatarUrl==="" ? defaultAvatar : avatarUrl}
                                         alt="avatar"/>
                                    <PopupRectangle popupShown={rectangleShown} popupText={"change avatar"} positionX={AbsolutePositionX.MIDDLE} positionY={AbsolutePositionY.BOTTOM}></PopupRectangle>
                                    <input style={{display: "none"}} type={"file"} name={"image"}
                                           key={imageInputKey} onChange={imagePreview}/>
                                </label>
                                <p className={imageUploadFailed ? classes.uploadError + " " + classes.uploadErrorShown : classes.uploadError}>
                                    {imageUploadErrorMsg}
                                </p>
                                <SettingsDelBtn show={avatarUrl !== ""} del={deleteAvatar} setDel={setDeleteAvatar} title={"Remove photo"}/>
                            </Section>

                            <Section title={"Bio"}>
                                <textarea className={classes.bio} name="bio" cols={50} rows={6} defaultValue={bio} maxLength={255}></textarea>
                            </Section>

                            <button type={"submit"} className={classes.updateProfile}>Update profile</button>
                        </form>
                        <Popup popupInfo={"Profile updated."} shown={popupShown} setShown={setPopupShown} popupConfirm={"Ok"}></Popup>
                    </div>
            }
        </div>
    );
};

export default SettingsProfile;