import React, {FC} from 'react';
import classes from "./SettingsComponents.module.css";
import {useNavigate} from "react-router-dom";

interface SettingsOptionProps {
    active: boolean
    settingName: string,
    settingUrl: string
}

const SettingsOption: FC<SettingsOptionProps> = React.memo(({settingName, settingUrl, active}) => {
    let navigateFunction = useNavigate();

    return (
        <div className={classes.settings__option}>
            <div className={active ? classes.settings__optionInner + " " + classes.active : classes.settings__optionInner}
                 onClick={() => navigateFunction(settingUrl)}>
                <p className={classes.settings__optionText}>
                    {settingName}
                </p>
            </div>
        </div>
    );
});

export default SettingsOption;