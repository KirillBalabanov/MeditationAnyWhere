import React, {FC} from 'react';
import classes from "../Profile.module.css";
import {useNavigate} from "react-router-dom";

interface EditProfileBtnProps {
    show: boolean
}

const EditProfileBtn: FC<EditProfileBtnProps> = React.memo(({show}) => {
    let navigateFunction = useNavigate();
    return (
        <div className={classes.profile__button} onClick={() => navigateFunction("/settings/profile")}
        style={{display: show ? "block" : "none"}}
        >
            Edit Profile
        </div>
    );
});

export default EditProfileBtn;