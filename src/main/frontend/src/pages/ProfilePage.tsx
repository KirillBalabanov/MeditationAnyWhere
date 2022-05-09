import React, {useContext, useState} from 'react';
import {useParams} from "react-router-dom";
import {useFetching} from "../hooks/useFetching";
import Error from "./Error";
import Loader from "../components/loader/Loader";
import classes from "../styles/ProfilePage.module.css";
import {ErrorI, UserProfileI} from "../types/types";
import Profile from "../components/profile/Profile";
import ProfileInfo from "../components/profile/info/ProfileInfo";
import ProfileStats from "../components/profile/stats/ProfileStats";
import ProfileAvatar from "../components/profile/info/ProfileAvatar";
import ProfileUsername from "../components/profile/info/ProfileUsername";
import ProfileBio from "../components/profile/info/ProfileBio";
import EditProfileBtn from "../components/profile/info/EditProfileBtn";
import ProfileDateJoined from "../components/profile/info/ProfileDateJoined";
import ProfileStatBox from "../components/profile/stats/ProfileStatBox";
import {AuthContext} from "../context/AuthContext";

const ProfilePage = () => {
    const [isLoading, setIsLoading] = useState(true);

    let usernameUrl = useParams()["username"];
    let authContext = useContext(AuthContext);

    const [profile, setProfile] = useState<UserProfileI | null | ErrorI>(null);

    const fetched = useFetching<UserProfileI | null | ErrorI>("/user/profile/" + usernameUrl, setIsLoading, setProfile);

    if(!fetched) return (<Error errorMsg={profile != null && "errorMsg" in profile && profile.errorMsg}/>);

    return (
        <div>
            {
                isLoading
                    ?
                    <Loader></Loader>
                    :
                    <div className="container">
                        <div className={classes.main}>
                            {
                                profile != null && "avatarUrl" in profile
                                &&
                                <Profile>
                                    <ProfileInfo>
                                        <ProfileAvatar avatarUrl={profile.avatarUrl} username={usernameUrl!}/>
                                        <ProfileUsername username={profile.username}/>
                                        <ProfileBio bio={profile.bio}/>
                                        <EditProfileBtn show={usernameUrl == authContext?.auth}/>
                                        <ProfileDateJoined registrationDate={profile.registrationDate}/>
                                    </ProfileInfo>

                                    <ProfileStats>
                                        <ProfileStatBox title={"Minutes Listened"} data={profile.minListened.toString()}/>
                                        <ProfileStatBox title={"Sessions Listened"} data={profile.sessionsListened.toString()}/>
                                        <ProfileStatBox title={"Current Streak"} data={profile.currentStreak.toString()}/>
                                        <ProfileStatBox title={"Longest Streak"} data={profile.longestStreak.toString()}/>
                                    </ProfileStats>
                                </Profile>
                            }
                        </div>
                    </div>
            }
        </div>
    );
};

export default ProfilePage;