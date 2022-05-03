import React, {useState} from 'react';
import classes from "./UserProfile.module.css";
import defaultAvatar from "../../images/defaultAvatar.svg";
import timeIcon from "../../images/timeIcon.svg";
import polygon from "../../images/polygonOnRectangleGray.svg";
import {useNavigate} from "react-router-dom";
import Date from "../date/Date";

const UserProfile = ({profile}: any) => {

    const [popupShown, setPopupShown] = useState(false);
    let navigateFunction = useNavigate();




    return (
        <div className={classes.profile}>
            <div className={classes.profile__info}>
                <img src={defaultAvatar} alt="avatar"
                     className={classes.profile__infoAvatar} onMouseOver={() => setPopupShown(true)}
                     onMouseLeave={() => setPopupShown(false)}
                     onClick={() => navigateFunction("/settings")}
                />
                <div className={popupShown ? classes.profile__popup + " " + classes.shown : classes.profile__popup}>
                    <div className={classes.profile__popupText}>change your avatar</div>
                    <img src={polygon} alt="avatar" className={classes.profile__popupIcon}/>
                </div>
                <div className={classes.profile__username}>{profile.username}</div>
                <div className={classes.profile__status}>
                    status status status status status status status status status status status status
                    status status status status status status status status.
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
                                <Date date={profile.registrationDate}></Date>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={classes.stats}>
                <div className={classes.stats__box}>
                    <p className={classes.stats__boxTitle}>Minutes Listened</p>
                    <p className={classes.stats__boxData}>{profile.minListened}</p>
                </div>
                <div className={classes.stats__box}>
                    <p className={classes.stats__boxTitle}>Sessions Listened</p>
                    <p className={classes.stats__boxData}>{profile.sessionsListened}</p>
                </div>
                <div className={classes.stats__box}>
                    <p className={classes.stats__boxTitle}>Current Streak</p>
                    <p className={classes.stats__boxData}>{profile.currentStreak}</p>
                </div>
                <div className={classes.stats__box}>
                    <p className={classes.stats__boxTitle}>Longest Streak</p>
                    <p className={classes.stats__boxData}>{profile.longestStreak}</p>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;