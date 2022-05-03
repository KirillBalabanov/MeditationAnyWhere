import React from 'react';
import defaultAvatar from "../../../images/defaultAvatar.svg";
import classes from "./SettingsProfile.module.css";

const SettingsProfile = () => {
    return (
        <div>
            <div className={classes.profile__section}>
                <p className={classes.profile__sectionTitle}>Profile picture</p>
                <img className={classes.avatar} src={defaultAvatar} alt="avatar"/>
                <button className={classes.profile__sectionButton + " " + classes.upload}>Upload a photo</button>
                <button className={classes.profile__sectionButton + " " + classes.remove}>Remove photo</button>
            </div>
            <form>
                <div className={classes.profile__section}>
                    <p className={classes.profile__sectionTitle}>Bio</p>
                    <textarea className={classes.bio} name="bio" cols={50} rows={7}></textarea>
                </div>
                <button className={classes.profile__sectionButton + " " + classes.updateProfile}>Update profile</button>
            </form>

        </div>
    );
};

export default SettingsProfile;