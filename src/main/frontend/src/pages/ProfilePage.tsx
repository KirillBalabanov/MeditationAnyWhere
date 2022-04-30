import React, {useState} from 'react';
import {useParams} from "react-router-dom";
import Header from "../components/header/Header";
import {useFetching} from "../hooks/useFetching";
import Error from "./Error";
import Loader from "../components/loading/Loader";
import UserProfile from "../components/profile/UserProfile";
import classes from "../styles/ProfilePage.module.css";

const ProfilePage = () => {

    const [isLoading, setIsLoading] = useState(true);

    let username = useParams()["username"];
    let profileModel = {
        username: "",
        minListened: "",
        sessionsListened: "",
        currentStreak: "",
        longestStreak: ""
    }
    const [profile, setProfile] = useState(profileModel);

    const [fetched, errorMsg] = useFetching("/profile/" + username, setProfile, setIsLoading);


    if(!fetched) return (<Error errorMsg={errorMsg}/>);

    return (
        <div>
            <Header></Header>
            <div className="container">
                <div className={classes.main}>
                    {
                        isLoading
                            ?
                            <Loader></Loader>
                            :
                            <UserProfile profile={profile}></UserProfile>
                    }
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;