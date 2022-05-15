import React, {FC} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import classes from "../styles/Settings.module.css";
import SettingsProfile from "../../components/settings/profile/SettingsProfile";
import SettingsAccount from "../../components/settings/account/SettingsAccount";
import SettingsLibrary from "../../components/settings/library/SettingsLibrary";
import {useAuthContext} from "../../context/AuthContext";
import {useAuthRedirect} from "../../hooks/useAuthRedirect";

const Settings: FC = () => {
    const setting = useParams()["setting"];
    let navigateFunction = useNavigate();

    let authContext = useAuthContext();

    useAuthRedirect(authContext!);

    const navigate = (to: string) => {
        navigateFunction(to);
    };

    return (
        <div>
            <div className="container">
                <div className={classes.settings__outer}>
                    <div className={classes.settings}>
                        <div className={classes.settings__option}>
                            <div className={setting==="profile" ? classes.settings__optionInner + " " + classes.active : classes.settings__optionInner}
                                 onClick={() => navigate("/settings/profile")}>
                                <p className={classes.settings__optionText}>
                                    Profile
                                </p>
                            </div>
                        </div>
                        <div className={classes.settings__option}>
                            <div className={setting==="account" ? classes.settings__optionInner + " " + classes.active : classes.settings__optionInner}
                                 onClick={() => navigate("/settings/account")}>
                                <p className={classes.settings__optionText}>
                                    Account
                                </p>
                            </div>
                        </div>
                        <div className={classes.settings__option}>
                            <div className={setting==="library" ? classes.settings__optionInner + " " + classes.active : classes.settings__optionInner}
                                 onClick={() => navigate("/settings/library")}>
                                <p className={classes.settings__optionText}>
                                    Library
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={classes.settings__setting}>
                        <h3 className={classes.setting__title}>
                            {setting==="profile" && "Public profile"}
                            {setting==="account" && "Account"}
                            {setting==="library" && "Library"}
                        </h3>
                        {setting==="profile" && <SettingsProfile></SettingsProfile>}
                        {setting==="account" && <SettingsAccount></SettingsAccount>}
                        {setting==="library" && <SettingsLibrary></SettingsLibrary>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;