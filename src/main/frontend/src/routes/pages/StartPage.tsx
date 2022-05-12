import React, {FC, useEffect, useState} from 'react';
import {Link} from "react-router-dom";

import classes from "../styles/StartPage.module.css";
import {useHeaderContext} from "../../context/HeaderContext";

const speed = 0.003;

const StartPage: FC = () => {
    const headerContext = useHeaderContext();

    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    const mouseMoveHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        const startPositionX = window.innerWidth / 2;
        const startPositionY = window.innerHeight / 2;
        setX((e.pageX - startPositionX) * speed);
        setY((e.pageY - startPositionY) * speed);
    };

    useEffect(() => {
        headerContext?.setShowHeader(false);

        return () => {
            headerContext?.setShowHeader(true);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={classes.body} onMouseMove={mouseMoveHandler}>
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