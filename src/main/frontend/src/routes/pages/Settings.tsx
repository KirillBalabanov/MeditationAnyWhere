import React, {FC, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import classes from "../styles/Settings.module.css";
import SettingsProfile from "../../components/settings/subpages/profile/SettingsProfile";
import SettingsAccount from "../../components/settings/subpages/account/SettingsAccount";
import SettingsLibrary from "../../components/settings/subpages/library/SettingsLibrary";
import {useAuthContext, useRefreshAuthContext} from "../../context/AuthContext";
import Loader from "../../components/loader/Loader";
import SettingsOption from "../../components/settings/components/SettingsOption";
import SettingsContent from "../../components/settings/components/SettingsContent";

export enum SettingOptions {
    profile = "profile",
    account = "account",
    library = "library",
}

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
                        <SettingsOption active={setting===SettingOptions.profile} settingName={"Profile"} settingUrl={"/settings/profile"}/>
                        <SettingsOption active={setting===SettingOptions.account} settingName={"Account"} settingUrl={"/settings/account"}/>
                        <SettingsOption active={setting===SettingOptions.library} settingName={"Library"} settingUrl={"/settings/library"}/>
                    </div>
                    {setting===SettingOptions.profile&&<SettingsContent title={"Public profile"}><SettingsProfile/></SettingsContent>}
                    {setting===SettingOptions.account&&<SettingsContent title={"Account"}><SettingsAccount/></SettingsContent>}
                    {setting===SettingOptions.library&&<SettingsContent title={"Library"}><SettingsLibrary/></SettingsContent>}
                </div>
            </div>
        </div>
    );
};

export default Settings;