import React, {FC, useContext, useEffect, useState} from 'react';
import {Link} from "react-router-dom";

import classes from "../styles/StartPage.module.css";
import {HeaderContext, HeaderContextI} from "../context/HeaderContext";

const speed = 0.003;

const StartPage: FC = () => {
    const headerContext = useContext<HeaderContextI | null>(HeaderContext);

    useEffect(() => {
        headerContext?.setShowHeader(false);

        return () => {
            headerContext?.setShowHeader(true);
        };
    }, []);

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