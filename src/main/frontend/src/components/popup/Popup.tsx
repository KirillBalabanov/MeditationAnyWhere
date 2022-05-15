import React, {FC, useEffect} from 'react';
import classes from "./Popup.module.css";

interface PopupProps {
    popupInfo: string,
    popupConfirm?: string,
    shown: boolean,
    setShown(status: boolean): void
}

const Popup: FC<PopupProps> = React.memo(({popupConfirm, popupInfo, shown, setShown}) => {
    const popupClasses = [classes.popup];
    if (shown) {
        popupClasses.push(classes.active);
    }

    useEffect(() => {
        const keyListener = (e: KeyboardEvent) => {
            if(e.code === "Escape") setShown(false);
        }
        window.addEventListener("keyup", keyListener);
        return () => {
            window.removeEventListener("keyup", keyListener);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={popupClasses.join(" ")} onClick={() => setShown(false)}>
            <div className={classes.popup__box} onClick={(e) => e.stopPropagation()}>
                <div className={classes.popup__info}>
                    {popupInfo}
                </div>
                <div className={classes.popup__confirm} onClick={() => setShown(false)}>
                    {popupConfirm}
                </div>
            </div>
        </div>
    );
});

export default Popup;