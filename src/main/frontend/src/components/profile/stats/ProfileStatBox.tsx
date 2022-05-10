import React, {FC} from 'react';
import classes from "../Profile.module.css";

interface ProfileStatBoxProps {
    title: string,
    data: string
}

const ProfileStatBox: FC<ProfileStatBoxProps> = React.memo(({title, data}) => {
    return (
        <div className={classes.stats__box}>
            <p className={classes.stats__boxTitle}>{title}</p>
            <p className={classes.stats__boxData}>{data}</p>
        </div>
    );
});

export default ProfileStatBox;