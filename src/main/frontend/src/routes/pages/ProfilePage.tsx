import React, {FC, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import ErrorPage from "./ErrorPage";
import Loader from "../../components/loader/Loader";
import classes from "../styles/ProfilePage.module.css";
import Profile from "../../components/profile/Profile";
import ProfileInfo from "../../components/profile/info/ProfileInfo";
import ProfileStats from "../../components/profile/stats/ProfileStats";
import ProfileAvatar from "../../components/profile/info/ProfileAvatar";
import ProfileUsername from "../../components/profile/info/ProfileUsername";
import ProfileBio from "../../components/profile/info/ProfileBio";
import EditProfileBtn from "../../components/profile/info/EditProfileBtn";
import ProfileDateJoined from "../../components/profile/info/ProfileDateJoined";
import ProfileStatBox from "../../components/profile/stats/ProfileStatBox";
import {useCacheStore} from "../../context/CacheStore/CacheStoreContext";
import {ErrorFetchI, UserProfileFetchI} from "../../types/serverTypes";
import {UserActionTypes} from "../../reducer/userReducer";

const ProfilePage: FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    let usernameUrl = useParams()["username"];

    const cacheStore = useCacheStore()!;
    const [userState, userDispatcher] = cacheStore.userReducer;
    const [authState] = cacheStore.authReducer;

    const [profile, setProfile] = useState<UserProfileFetchI | null | ErrorFetchI>(null);
    const [profileFetchError, setProfileFetchError] = useState("");

    useEffect(() => {

        // person's page
        if(userState.username === usernameUrl) {

            if (userState.stats !== null && userState.registrationDate !== null && userState.avatar !== null &&
                userState.bio !== null && userState.username !== null) { // get from cache
                setProfile({
                    minListened: userState.stats.minListened,
                    sessionsListened: userState.stats.sessionsListened,
                    currentStreak: userState.stats.currentStreak,
                    longestStreak: userState.stats.longestStreak,
                    registrationDate: userState.registrationDate,
                    bio: userState.bio.bio === null ? "" : userState.bio.bio,
                    avatarUrl: userState.avatar.url,
                    username: userState.username,
                })
                setIsLoading(false);
                return;
            }
            // fetch to cache
            fetch("/users/" + usernameUrl).then((response) => response.json()).then((data: ErrorFetchI | UserProfileFetchI) => {
                if ("errorMsg" in data) {
                    setProfileFetchError(data.errorMsg);
                    return;
                }
                setProfile(data);

                userDispatcher({type: UserActionTypes.SET_STATS, payload: {
                        minListened: data.minListened,
                        sessionsListened: data.sessionsListened,
                        currentStreak: data.currentStreak,
                        longestStreak: data.longestStreak,
                    }})
                userDispatcher({type: UserActionTypes.SET_REGISTRATION_DATE, payload: data.registrationDate})
                userDispatcher({type: UserActionTypes.SET_USERNAME, payload: data.username})
                userDispatcher({type: UserActionTypes.SET_BIO, payload: {bio: data.bio}})
                userDispatcher({type: UserActionTypes.SET_AVATAR, payload: {url: data.avatarUrl}})

                setIsLoading(false)
            });

            return;
        }

        // page of another user
        fetch("/users/" + usernameUrl).then((response) => response.json()).then((data: ErrorFetchI | UserProfileFetchI) => {
            if ("errorMsg" in data) {
                setProfileFetchError(data.errorMsg);
                return;
            }
            setProfile(data);
            setIsLoading(false)
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    if(profileFetchError !== "") return (<ErrorPage errorMsg={profileFetchError}/>);

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
                                profile !== null && "username" in profile
                                &&
                                <Profile>
                                    <ProfileInfo>
                                        <ProfileAvatar avatarUrl={profile.avatarUrl} username={usernameUrl!}/>
                                        <ProfileUsername username={profile.username}/>
                                        <ProfileBio bio={profile.bio === null ? "" : profile.bio}/>
                                        <EditProfileBtn show={authState.auth}/>
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