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
    let token = useContext(CsrfContext)?.csrfToken;
    const [isLoading, setIsLoading] = useState(true);
    let authContext = useContext(AuthContext);

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

    function logout() {
        authContext?.setAuth(false);
        authContext?.setUsername("$anonymous");
        fetch("/logout", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': token!
            }
        })
    }

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
                            <div>
                                <UserProfile profile={profile}></UserProfile>
                                {
                                    authContext?.username === username &&
                                    <button className={classes.logout} onClick={logout}>
                                        logout
                                    </button>
                                }
                            </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;