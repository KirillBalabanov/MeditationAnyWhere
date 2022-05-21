import React, {FC, SetStateAction} from 'react';
import classes from "./Popup.module.css";
import {usePopup} from "./usePopup";
import popupCloseIcon from "../../images/closePopupBtn.svg";

interface PopupProps {
    popupInfo: string,
    popupConfirm?: string,
    shown: boolean,
    setShown: React.Dispatch<SetStateAction<boolean>>
}

const Popup: FC<PopupProps> = React.memo(({popupConfirm, popupInfo, shown, setShown}) => {
    usePopup(setShown);

    return (
        <div className={shown ? classes.popup + " " + classes.active : classes.popup} onMouseDown={() => setShown(false)}>
            <div className={classes.popup__box} onMouseDown={(e) => e.stopPropagation()}>
                <div className={classes.popup__info}>
                    {popupInfo}
                </div>
                <div className={classes.popup__confirm} onClick={() => setShown(false)}>
                    {popupConfirm}
                </div>
                <div className={classes.popup__close} onClick={() => setShown(false)}>
                    <img src={popupCloseIcon} alt="ClosePopup"/>
                </div>
            </div>
        </div>
    );
});

export default Popup;