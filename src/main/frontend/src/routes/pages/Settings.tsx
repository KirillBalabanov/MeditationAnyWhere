import React, {FC, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import classes from "../styles/Settings.module.css";
import SettingsProfile from "../../components/settings/profile/SettingsProfile";
import SettingsAccount from "../../components/settings/account/SettingsAccount";
import SettingsLibrary from "../../components/settings/library/SettingsLibrary";
import {useAuthContext, useRefreshAuthContext} from "../../context/AuthContext";
import Loader from "../../components/loader/Loader";

const Settings: FC = () => {
    const setting = useParams()["setting"];
    let navigateFunction = useNavigate();

    let authContext = useAuthContext();
    const [refreshAuthLoading, setRefreshAuthLoading] = useState(true);
    useRefreshAuthContext(authContext!, setRefreshAuthLoading);

    if(refreshAuthLoading) return (<Loader></Loader>)

    if(!authContext?.auth) navigateFunction("/login");

    return (
        <div>
            <div className="container">
                <div className={classes.settings__outer}>
                    <div className={classes.settings}>
                        <div className={classes.settings__option}>
                            <div className={setting==="profile" ? classes.settings__optionInner + " " + classes.active : classes.settings__optionInner}
                                 onClick={() => navigateFunction("/settings/profile")}>
                                <p className={classes.settings__optionText}>
                                    Profile
                                </p>
                            </div>
                        </div>
                        <div className={classes.settings__option}>
                            <div className={setting==="account" ? classes.settings__optionInner + " " + classes.active : classes.settings__optionInner}
                                 onClick={() => navigateFunction("/settings/account")}>
                                <p className={classes.settings__optionText}>
                                    Account
                                </p>
                            </div>
                        </div>
                        <div className={classes.settings__option}>
                            <div className={setting==="library" ? classes.settings__optionInner + " " + classes.active : classes.settings__optionInner}
                                 onClick={() => navigateFunction("/settings/library")}>
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