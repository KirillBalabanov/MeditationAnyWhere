import React, {FC, useContext, useState} from 'react';
import classes from "../Profile.module.css";
import defaultAvatar from "../../../images/defaultAvatar.svg";
import PopupRectangle from "../../popup/PopupRectangle";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../../context/AuthContext";

interface ProfileAvatarProps {
    avatarUrl: string,
    username: string
}

const ProfileAvatar: FC<ProfileAvatarProps> = ({avatarUrl, username}) => {
    let navigateFunction = useNavigate();
    const [popupShown, setPopupShown] = useState(false);
    const authContext = useContext(AuthContext);

    let isAuthUserPage: boolean = username == authContext?.username;

    return (
        <div className={classes.profile__infoAvatarOuter}>
            <img src={avatarUrl==="" ? defaultAvatar : avatarUrl} alt="avatar"
                 className={classes.profile__infoAvatar} onMouseOver={() => {
                    if(!isAuthUserPage) return; // avatar of other user
                    setPopupShown(true)
                 }}
                 onMouseLeave={() => setPopupShown(false)}
                 onClick={() => {
                     if(!isAuthUserPage) return;
                     navigateFunction("/settings/profile")
                 }}
                 style={{cursor: isAuthUserPage ? "pointer" : "auto"}}
            />
            <PopupRectangle popupShown={popupShown} popupText={"change your avatar"} top={300} left={85}></PopupRectangle>
        </div>
    );
};

export default ProfileAvatar;