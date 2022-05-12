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
    const outer = useRef<HTMLDivElement>(null);
    const popup = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (outer.current != null && popup.current != null) {
            let width = outer.current!.offsetWidth;
            let height = outer.current!.offsetHeight;
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
    }, [outer.current]);

    return (
        <div style={{width: "inherit", height: "inherit"}} ref={outer}>
            <div className={popupShown ? classes.profile__popup + " " + classes.shown : classes.profile__popup} ref={popup}
                 style={{
                     top: top,
                     left: left,
            }}>
                <div className={classes.profile__popupText}>{popupText}</div>
                <img src={polygon} alt="polygon" className={classes.profile__popupIcon}/>
            </div>
        </div>
    );
});

export default PopupRectangle;