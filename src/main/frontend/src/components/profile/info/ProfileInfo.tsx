import React, {FC} from 'react';
import classes from "../Profile.module.css";

interface ProfileInfoProps {
    children: React.ReactNode
}

const ProfileInfo: FC<ProfileInfoProps> = React.memo(({children}) => {

    return (
        <div className={classes.profile__info}>
            {children}
        </div>
    );
});

export default ProfileInfo;