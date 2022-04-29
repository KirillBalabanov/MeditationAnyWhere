import React from 'react';
import classes from "./Popup.module.css";

interface PopupProps {
    popupInfo: string,
    popupConfirm?: string,
    active: boolean,
    setStatus(status: boolean): void
}

const Popup = (props: PopupProps) => {
    const popupClasses = [classes.popup];
    if (props.active) {
        popupClasses.push(classes.active);
    }

    return (
        <div className={popupClasses.join(" ")} onClick={() => props.setStatus(false)}>
            <div className={classes.popup__box} onClick={(e) => e.stopPropagation()}>
                <div className={classes.popup__info}>
                    {props.popupInfo}
                </div>
                <div className={classes.popup__confirm} onClick={() => props.setStatus(false)}>
                    {props.popupConfirm}
                </div>
            </div>
        </div>
    );
};

export default Popup;