import React, {MouseEventHandler, useRef, useState} from 'react';
import {Link} from "react-router-dom";

import classes from "../styles/StartPage.module.css";

const StartPage = () => {
    const speed = 0.003;
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    return (
        <div className={classes.body} onMouseMove={(e) => {
            const windowSizeX = window.innerWidth;
            const windowSizeY = window.innerHeight;

            const startPositionX = windowSizeX / 2;
            const startPositionY = windowSizeY / 2;

            setX((e.pageX - startPositionX) * speed);
            setY((e.pageY - startPositionY) * speed);
        }}>
            <div className={classes.frame} style={{transform: "translate(" + x + "%, " + y + "%)"}}></div>
            <div className={classes.start}>
                <div className={classes.start__inner}>
                    <h1 className={classes.start__title}>Meditation Any Where</h1>
                    <Link to={"/"} className={classes.start__link}>start</Link>
                </div>
            </div>
        </div>
    );
};

export default StartPage;