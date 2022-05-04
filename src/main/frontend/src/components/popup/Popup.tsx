import React, {useEffect} from 'react';
import classes from "./Popup.module.css";

interface PopupProps {
    popupInfo: string,
    popupConfirm?: string,
    shown: boolean,
    setShown(status: boolean): void
}

const Popup = (props: PopupProps) => {
    const popupClasses = [classes.popup];
    if (props.shown) {
        popupClasses.push(classes.active);
    }

    useEffect(() => {
        const keyListener = (e: KeyboardEvent) => {
            if(e.code == "Escape") props.setShown(false);
        }
        window.addEventListener("keyup", keyListener);
        return () => {
            window.removeEventListener("keyup", keyListener);
        };
    }, []);

    return (
        <div className={popupClasses.join(" ")} onClick={() => props.setShown(false)}>
            <div className={classes.popup__box} onClick={(e) => e.stopPropagation()}>
                <div className={classes.popup__info}>
                    {props.popupInfo}
                </div>
                <div className={classes.popup__confirm} onClick={() => props.setShown(false)}>
                    {props.popupConfirm}
                </div>
            </div>
        </div>
    );
};

export default Popup;