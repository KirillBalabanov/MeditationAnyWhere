import React from 'react';
import classes from "./UserProfile.module.css";

const UserProfile = ({profile}: any) => {
    return (
        <div className={classes.profile}>
            <div className={classes.profile__username}>username: <span>{profile.username}</span></div>
            <div className={classes.profile__data}>
                <div className={classes.data}>
                    <p className={classes.data__title}>min listened</p>
                    <h4 className={classes.data__data}>{profile.minListened}</h4>
                </div>
                <div className={classes.data}>
                    <p className={classes.data__title}>sessions listened</p>
                    <h4 className={classes.data__data}>{profile.sessionsListened}</h4>
                </div>
                <div className={classes.data}>
                    <p className={classes.data__title}>current streak</p>
                    <h4 className={classes.data__data}>{profile.currentStreak}</h4>
                </div>
                <div className={classes.data}>
                    <p className={classes.data__title}>longest streak</p>
                    <h4 className={classes.data__data}>{profile.longestStreak}</h4>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;