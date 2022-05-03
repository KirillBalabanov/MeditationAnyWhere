import React, {useContext, useState} from 'react';
import {useParams} from "react-router-dom";
import Header from "../components/header/Header";
import {useFetching} from "../hooks/useFetching";
import Error from "./Error";
import Loader from "../components/loading/Loader";
import UserProfile from "../components/profile/UserProfile";
import classes from "../styles/ProfilePage.module.css";
import {AuthContext} from "../context/AuthContext";
import {CsrfContext} from "../context/CsrfContext";

const ProfilePage = () => {
    let csrfContext = useContext(CsrfContext);
    const [isLoading, setIsLoading] = useState(true);
    let authContext = useContext(AuthContext);

    let username = useParams()["username"];
    let profileModel = {
        username: "",
        minListened: "",
        sessionsListened: "",
        currentStreak: "",
        longestStreak: "",
        registrationDate: "",
        bio: "",
        avatarFilePath: ""
    }
    const [profile, setProfile] = useState(profileModel);

    const [fetched, errorMsg] = useFetching("/profile/" + username, setProfile, setIsLoading);

    if(!fetched) return (<Error errorMsg={errorMsg}/>);

    return (
        <div>
            <Header></Header>
            {
                isLoading
                    ?
                    <Loader></Loader>
                    :
                    <div className="container">
                        <div className={classes.main}>
                            <UserProfile profile={profile}></UserProfile>
                        </div>
                    </div>
            }
        </div>
    );
};

export default ProfilePage;