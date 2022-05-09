import React, {useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useFetching} from "../hooks/useFetching";
import Error from "./Error";
import Loader from "../components/loader/Loader";
import classes from "../styles/ProfilePage.module.css";
import defaultAvatar from "../images/defaultAvatar.svg";
import timeIcon from "../images/timeIcon.svg";
import Date from "../components/date/Date";
import PopupRectangle from "../components/popup/PopupRectangle";
import {UserProfileI} from "../types/types";

const ProfilePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [popupShown, setPopupShown] = useState(false);
    let navigateFunction = useNavigate();

    let username = useParams()["username"];
    const [profile, setProfile] = useState<UserProfileI | null>(null);

    const [fetched, errorMsg] = useFetching("/user/profile/" + username, setProfile, setIsLoading);

    if(!fetched || (!isLoading && profile == null)) return (<Error errorMsg={errorMsg}/>);

    return (
        <div>
            {
                isLoading
                    ?
                    <Loader></Loader>
                    :
                    <div className="container">
                        <div className={classes.main}>
                            <div className={classes.profile}>
                                <div className={classes.profile__info}>
                                    <div className={classes.profile__infoAvatarOuter}>
                                        <img src={profile!.avatarUrl==="" ? defaultAvatar : profile!.avatarUrl} alt="avatar"
                                             className={classes.profile__infoAvatar} onMouseOver={() => setPopupShown(true)}
                                             onMouseLeave={() => setPopupShown(false)}
                                             onClick={() => navigateFunction("/settings/profile")}
                                        />
                                    </div>
                                    <PopupRectangle popupShown={popupShown} popupText={"change your avatar"} top={300} left={85}></PopupRectangle>
                                    <div className={classes.profile__username}>{profile!.username}</div>
                                    <div className={classes.profile__status}>
                                        {profile!.bio}
                                    </div>
                                    <div className={classes.profile__button} onClick={() => navigateFunction("/settings/profile")}>
                                        Edit Profile
                                    </div>
                                    <div className={classes.profile__time}>
                                        <div className={classes.profile__timeInner}>
                                            <img src={timeIcon} alt="timeIcon" className={classes.profile__timeIcon}/>
                                            <div className={classes.profile__timeData}>
                                                <div>
                                                    Joined
                                                </div>
                                                <div>
                                                    <Date date={profile!.registrationDate}></Date>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={classes.stats}>
                                    <div className={classes.stats__box}>
                                        <p className={classes.stats__boxTitle}>Minutes Listened</p>
                                        <p className={classes.stats__boxData}>{profile!.minListened}</p>
                                    </div>
                                    <div className={classes.stats__box}>
                                        <p className={classes.stats__boxTitle}>Sessions Listened</p>
                                        <p className={classes.stats__boxData}>{profile!.sessionsListened}</p>
                                    </div>
                                    <div className={classes.stats__box}>
                                        <p className={classes.stats__boxTitle}>Current Streak</p>
                                        <p className={classes.stats__boxData}>{profile!.currentStreak}</p>
                                    </div>
                                    <div className={classes.stats__box}>
                                        <p className={classes.stats__boxTitle}>Longest Streak</p>
                                        <p className={classes.stats__boxData}>{profile!.longestStreak}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </div>
    );
};

export default ProfilePage;