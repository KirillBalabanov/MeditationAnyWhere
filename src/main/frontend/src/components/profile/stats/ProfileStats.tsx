import React, {FC} from 'react';
import classes from "../Profile.module.css";

interface ProfileStatsProps {
    children: React.ReactNode
}

const ProfileStats: FC<ProfileStatsProps> = ({children}) => {
    return (
        <div className={classes.stats}>
            {children}
        </div>
    );
};

export default ProfileStats;