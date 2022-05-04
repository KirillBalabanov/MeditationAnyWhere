import React from 'react';
import classes from "./PopupRectangle.module.css";
import polygon from "../../images/polygonOnRectangleGray.svg";

interface PopupRectangleI {
    popupShown: boolean,
    popupText: string,
    left: number,
    top: number
}

const PopupRectangle = ({popupShown, popupText, left, top}: PopupRectangleI) => {
    return (
        <div className={popupShown ? classes.profile__popup + " " + classes.shown : classes.profile__popup}
        style={{left: left, top: top}}>
            <div className={classes.profile__popupText}>{popupText}</div>
            <img src={polygon} alt="polygon" className={classes.profile__popupIcon}/>
        </div>
    );
};

export default PopupRectangle;