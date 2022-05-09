import React, {FC, useState} from 'react';
import classes from "../Profile.module.css";
import defaultAvatar from "../../../images/defaultAvatar.svg";
import PopupRectangle from "../../popup/PopupRectangle";
import timeIcon from "../../../images/timeIcon.svg";
import Date from "../../date/Date";
import {UserProfileI} from "../../../types/types";
import {useNavigate} from "react-router-dom";

interface ProfileInfoProps {
    profile: UserProfileI,
    children: React.ReactNode
}

const ProfileInfo: FC<ProfileInfoProps> = ({profile, children}) => {


    return (
        <div className={classes.profile__info}>
            {children}
        </div>
    );
};

export default ProfileInfo;