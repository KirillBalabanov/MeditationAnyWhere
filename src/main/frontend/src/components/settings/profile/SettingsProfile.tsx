import React, {FormEvent, useContext, useEffect, useState} from 'react';
import defaultAvatar from "../../../images/defaultAvatar.svg";
import classes from "./SettingsProfile.module.css";
import Section from "../section/Section";
import {CsrfContext} from "../../../context/CsrfContext";
import {useFetching} from "../../../hooks/useFetching";
import Loader from "../../loading/Loader";

const SettingsProfile = () => {
    const token = useContext(CsrfContext)?.csrfToken!;

    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");

    const [data, setData] = useState({bio: "", avatarUrl: ""});
    const [isLoading, setIsLoading] = useState(true);

    useFetching("/profile/settings/settings", setData, setIsLoading);

    useEffect(() => {
        setBio(data.bio);
        setAvatarUrl(data.avatarUrl);
    }, [data]);

    function formSubmit(e: FormEvent) {
        e.preventDefault();
        // @ts-ignore
        let image = e.target[0].files[0];
        // @ts-ignore
        let bio = e.target[2].value;

        let formData = new FormData();
        formData.append("bio", bio);
        formData.append("image", image);
        fetch("/profile/settings/update", {
            method: "PUT",
            headers: {
                'X-XSRF-TOKEN': token
            },
            body: formData
        }).then((response) => response.json()).then((data) => {
            setAvatarUrl(data["avatarUrl"]);
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
                                <label className={classes.upload}>
                                    <img className={classes.avatar}
                                         src={avatarUrl==="" ? defaultAvatar : avatarUrl}
                                         alt="avatar"/>
                                    <input style={{display: "none"}} type={"file"} name={"image"}/>
                                </label>

                                <button type={"button"} className={classes.remove}>Remove photo</button>
                            </Section>
                            <div>
                                <Section title={"Bio"}>
                                    <textarea className={classes.bio} name="bio" cols={50} rows={7} defaultValue={bio}></textarea>
                                </Section>
                            </div>
                            <button type={"submit"} className={classes.updateProfile}>Update profile</button>
                        </form>
                    </div>
            }
        </div>
    );
};

export default SettingsProfile;