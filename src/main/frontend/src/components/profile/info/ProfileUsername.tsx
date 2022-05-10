import React, {FC} from 'react';
import classes from "../Profile.module.css";

interface ProfileUsernameProps {
    username: string
}

const ProfileUsername: FC<ProfileUsernameProps> = React.memo(({username}) => {
    return (
        <div className={classes.profile__username}>{username}</div>
    );
});

export default ProfileUsername;