import React, {FC, SetStateAction} from 'react';
import classes from "./SettingsComponents.module.css";

interface SettingsDelBtnProps {
    del: boolean,
    setDel: React.Dispatch<SetStateAction<boolean>>,
    title: string
    show: boolean
}

const SettingsDelBtn: FC<SettingsDelBtnProps> = React.memo(({del, setDel, show, title}) => {
    return (
        <button type={"button"} className={del ? classes.remove + " " + classes.removeSelected : classes.remove}
                onClick={() => {
                    setDel(del => !del);
                }}
                style={{display: show ? "flex" : "none"}}>
            {title}
        </button>
    );
});

export default SettingsDelBtn;