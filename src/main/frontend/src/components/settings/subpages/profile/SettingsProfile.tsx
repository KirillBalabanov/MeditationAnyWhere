import React, {ChangeEvent, FC, FormEvent, useEffect, useState} from 'react';
import defaultAvatar from "../../../../images/defaultAvatar.svg";
import classes from "./SettingsProfile.module.css";
import Section from "../../components/SettingsContentSection";
import Loader from "../../../loader/Loader";
import PopupRectangle from "../../../popup/PopupRectangle";
import Popup from "../../../popup/Popup";
import {AbsolutePositionX, AbsolutePositionY} from "../../../../types/componentTypes";
import SettingsDelBtn from "../../components/SettingsDelBtn";
import {useStore} from "../../../../context/CacheStore/StoreContext";
import {ErrorFetchI, ProfileFetchI} from "../../../../types/serverTypes";
import {UserActionTypes} from "../../../../reducer/userReducer";
import {csrfFetching, FetchContentTypes, FetchingMethods} from "../../../../util/Fetch/csrfFetching";

const SettingsProfile: FC = () => {
    const cacheStore = useStore()!;
    const [userState, userDispatcher] = cacheStore.userReducer;


    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

    const [deleteAvatar, setDeleteAvatar] = useState(false);

    const [imageInputKey, setImageInputKey] = useState(Date.now());
    const [imageUploadErrorMsg, setImageUploadErrorMsg] = useState<null | string>(null);

    const [previewImage, setPreviewImage] = useState<null | File>(null);
    const [popupShown, setPopupShown] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(true);

    const [rectangleShown, setRectangleShown] = useState(false);

    useEffect(() => {
        fetch("/api/users/current/settings").then((response) => response.json()).then((data: ProfileFetchI) => {
            userDispatcher({type: UserActionTypes.SET_AVATAR, payload: {url: data.avatarUrl}})
            userDispatcher({type: UserActionTypes.SET_BIO, payload: {bio: data.bio}})
            setIsDataLoading(false)
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        setAvatarPreviewUrl(  userState.avatar !== null && userState.avatar.url !== null ? userState.avatar.url : null);
    }, [userState.avatar]);

    const imagePreview = (e: ChangeEvent) => {
        let fileReader = new FileReader();
        setImageUploadErrorMsg(null);
        setPreviewImage(null);
        // @ts-ignore
        let file = (e.target as HTMLInputElement).files[0];
        if(file == null) return;

        if (!file.type.match("image.*")) {
            setImageInputKey(Date.now()); // reset file input
            setImageUploadErrorMsg("Invalid type");
            return;
        }

        if(file.size > 3_000_000) {
            setImageInputKey(Date.now()); // reset file input
            setImageUploadErrorMsg("Image cannot exceed 3mb.");
            return;
        }

        fileReader.onloadend = () => {
            // @ts-ignore
            setAvatarPreviewUrl(fileReader.result);
        };
        setPreviewImage(file);
        fileReader.readAsDataURL(file);

    };

    const formSubmit = (e: FormEvent) => {
        e.preventDefault();

        let bioForm: string = e.currentTarget.querySelector("textarea")!.value;


        if(previewImage === null && bioForm === userState.bio?.bio && !deleteAvatar) { // in case no changes but user clicked the btn.
            return;
        }

        if(bioForm === userState.bio?.bio && deleteAvatar && userState.avatar?.url === null) return; // del but no avatar is set

        setImageUploadErrorMsg(null);

        let formData = new FormData();
        formData.append("bio", bioForm);
        formData.append("deleteAvatar", deleteAvatar.toString());
        if (previewImage !== null) {
            formData.append("image", previewImage);
        }


        csrfFetching("/api/users/current/settings/update", FetchingMethods.PUT, FetchContentTypes.MULTIPART_FORM_DATA, formData).then((response) => response.json()).then((data: ProfileFetchI | ErrorFetchI) => {
            if ("errorMsg" in data) {
                setImageUploadErrorMsg(data.errorMsg);
                return;
            }
            userDispatcher({type: UserActionTypes.SET_BIO, payload: {bio: data.bio}});
            userDispatcher({type: UserActionTypes.SET_AVATAR, payload: {url: data.avatarUrl}})

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
                                         src={avatarPreviewUrl === null ? defaultAvatar : avatarPreviewUrl}
                                         alt="avatar"/>
                                    <PopupRectangle popupShown={rectangleShown} popupText={"change avatar"} positionX={AbsolutePositionX.MIDDLE} positionY={AbsolutePositionY.BOTTOM}></PopupRectangle>
                                    <input style={{display: "none"}} type={"file"} name={"image"}
                                           key={imageInputKey} onChange={imagePreview}/>
                                </label>
                                <p className={imageUploadErrorMsg !== null ? classes.uploadError + " " + classes.uploadErrorShown : classes.uploadError}>
                                    {imageUploadErrorMsg}
                                </p>
                                <SettingsDelBtn show={userState.avatar !== null && userState.avatar.url !== null} del={deleteAvatar} setDel={setDeleteAvatar} title={"Remove photo"}/>
                            </Section>

                            <Section title={"Bio"}>
                                <textarea className={classes.bio} name="bio" cols={50} rows={6} defaultValue={(userState.bio !== null && userState.bio.bio !== null) ? userState.bio.bio : ""} maxLength={255}></textarea>
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