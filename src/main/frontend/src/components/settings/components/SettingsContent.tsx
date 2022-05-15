import React, {FC} from 'react';
import classes from "./SettingsComponents.module.css";

interface SettingsContentProps {
    children: React.ReactNode,
    title: string
}

const SettingsContent: FC<SettingsContentProps> = ({children, title}) => {
    return (
        <div className={classes.settings__setting}>
            <h3 className={classes.setting__title}>
                {title}
            </h3>
            {children}
        </div>
    );
};

export default SettingsContent;