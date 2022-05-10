import React, {FC} from 'react';
import classes from "../Profile.module.css";

interface ProfileBioProps {
    bio: string
}

const ProfileBio: FC<ProfileBioProps> = React.memo(({bio}) => {
    return (
        <div className={classes.profile__status}>
            {bio}
        </div>
    );
});

export default ProfileBio;