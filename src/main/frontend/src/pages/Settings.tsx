import React from 'react';
import {useNavigate, useParams} from "react-router-dom";
import Header from "../components/header/Header";
import classes from "../styles/Settings.module.css";
import SettingsProfile from "../components/settings/profile/SettingsProfile";
import SettingsAccount from "../components/settings/account/SettingsAccount";
import SettingsLibrary from "../components/settings/library/SettingsLibrary";

const Settings = () => {
    const setting = useParams()["setting"];
    let navigateFunction = useNavigate();

    const navigate = (to: string) => {
        navigateFunction(to);
    };

    return (
        <div>
            <Header></Header>
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
                        </h3>
                        {setting=="profile" && <SettingsProfile></SettingsProfile>}
                        {setting=="account" && <SettingsAccount></SettingsAccount>}
                        {setting=="library" && <SettingsLibrary></SettingsLibrary>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;