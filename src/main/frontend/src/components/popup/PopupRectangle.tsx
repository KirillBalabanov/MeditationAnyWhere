import React, {useEffect, useRef, useState} from 'react';
import classes from "./PopupRectangle.module.css";
import polygon from "../../images/polygonOnRectangleGray.svg";
import {AbsolutePositionX, AbsolutePositionY} from "../../types/componentTypes";

interface PopupRectangleI {
    popupShown: boolean,
    popupText: string,
    positionX: AbsolutePositionX,
    positionY: AbsolutePositionY,
}

const PopupRectangle = React.memo(({popupShown, popupText, positionX, positionY}: PopupRectangleI) => {

    const [top, setTop] = useState(0);
    const [left, setLeft] = useState(0);
    const popup = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (popup.current != null) {
            let width = popup.current.parentElement!.offsetWidth;
            let height = popup.current.parentElement!.offsetHeight;
            let popupWidth = popup.current!.offsetWidth;
            let popupHeight = popup.current!.offsetHeight;

            switch (positionX) {
                case AbsolutePositionX.LEFT:
                    setLeft(0);
                    break
                case AbsolutePositionX.MIDDLE:
                    setLeft((width / 2) - popupWidth / 2);
                    break
                case AbsolutePositionX.RIGHT:
                    setLeft(width);
                    break
            }

            switch (positionY) {
                case AbsolutePositionY.TOP:
                    setTop(0);
                    break
                case AbsolutePositionY.MIDDLE:
                    setTop((height / 2) + popupHeight / 2);
                    break
                case AbsolutePositionY.BOTTOM:
                    setTop(height);
                    break
            }
        }
    }, [popup.current]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={popupShown ? classes.popup + " " + classes.shown : classes.popup} ref={popup}
             style={{
                 top: top,
                 left: left,
             }}>
            <div className={classes.popupText}>{popupText}</div>
            <img src={polygon} alt="polygon" className={classes.popupIcon}/>
        </div>
    );
});

export default PopupRectangle;