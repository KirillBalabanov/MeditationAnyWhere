import React, {FormEvent, useContext, useState} from 'react';
import defaultAvatar from "../../../images/defaultAvatar.svg";
import classes from "./SettingsProfile.module.css";
import Section from "../section/Section";
import {CsrfContext} from "../../../context/CsrfContext";
import {useFetching} from "../../../hooks/useFetching";

const SettingsProfile = () => {
    const token = useContext(CsrfContext)?.csrfToken!;
    const [data, setData] = useState({bio: "", avatarPath: ""});
    const [isLoading, setIsLoading] = useState(false);

    const [fetched, errorMsg] = useFetching("/profile/settings", setData, setIsLoading);
    console.log(data);
    function formSubmit(e: FormEvent) {
        e.preventDefault();

        // @ts-ignore
        let image = e.target[0].files[0];
        // @ts-ignore
        let bio = e.target[2].value;

        let formData = new FormData();
        formData.append("bio", bio);
        formData.append("image", image);
        fetch("/profile/update", {
            method: "PUT",
            headers: {
                'X-XSRF-TOKEN': token
            },
            body: formData
        }).then((response) => response.json()).then((data) => {
            console.log(data);
        });
    }

    return (
        <div>
            <form onSubmit={formSubmit}>
                <Section title={"Profile image"}>
                    <img className={classes.avatar}
                         src={"http://192.168.132.103/profile/1/startBackground.jpg"}
                         alt="avatar"/>
                    <label className={classes.upload}>
                        Upload a photo
                        <input style={{display: "none"}} type={"file"} name={"image"}/>
                    </label>

                    <button type={"button"} className={classes.remove}>Remove photo</button>
                </Section>
                <div>
                    <Section title={"Bio"}>
                        <textarea className={classes.bio} name="bio" cols={50} rows={7} defaultValue={data.bio}></textarea>
                    </Section>
                </div>
                <button type={"submit"} className={classes.updateProfile}>Update profile</button>
            </form>
        </div>
    );
};

export default SettingsProfile;