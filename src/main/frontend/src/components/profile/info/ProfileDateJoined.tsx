import React, {FC} from 'react';
import classes from "../Profile.module.css";
import timeIcon from "../../../images/timeIcon.svg";
import Date from "../../date/Date";

interface ProfileDateJoinedProps {
    registrationDate: string
}

const ProfileDateJoined: FC<ProfileDateJoinedProps> = ({registrationDate}) => {
    return (
        <div className={classes.profile__time}>
            <div className={classes.profile__timeInner}>
                <img src={timeIcon} alt="timeIcon" className={classes.profile__timeIcon}/>
                <div className={classes.profile__timeData}>
                    <div>
                        Joined
                    </div>
                    <div>
                        <Date date={registrationDate}></Date>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileDateJoined;