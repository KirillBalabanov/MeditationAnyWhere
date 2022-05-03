import React from 'react';
import defaultAvatar from "../../../images/defaultAvatar.svg";
import classes from "./SettingsProfile.module.css";
import Section from "../section/Section";

const SettingsProfile = () => {
    return (
        <div>
            <Section title={"Profile image"}>
                <img className={classes.avatar} src={defaultAvatar} alt="avatar"/>
                <button className={classes.upload}>Upload a photo</button>
                <button className={classes.remove}>Remove photo</button>
            </Section>
            <form>
                <Section title={"Bio"}>
                    <textarea className={classes.bio} name="bio" cols={50} rows={7}></textarea>
                </Section>
            </form>
            <button className={classes.updateProfile}>Update profile</button>
        </div>
    );
};

export default SettingsProfile;