import React, {FC} from 'react';
import classes from "./Profile.module.css";

interface ProfileProps {
    children: React.ReactNode
}

const Profile: FC<ProfileProps> = ({children}) => {
    return (
        <div className={classes.profile}>
            {children}
        </div>
    );
};

export default Profile;