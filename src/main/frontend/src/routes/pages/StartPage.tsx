import React, {FC, useEffect, useState} from 'react';
import {Link} from "react-router-dom";

import classes from "../styles/StartPage.module.css";
import {useCacheStore} from "../../context/CacheStore/CacheStoreContext";
import {HeaderActionTypes} from "../../reducer/headerReducer";

const speed = 0.003;

const StartPage: FC = () => {
    const cacheStore = useCacheStore()!;
    const [, headerDispatcher] = cacheStore.headerReducer;

    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    const mouseMoveHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        const startPositionX = window.innerWidth / 2;
        const startPositionY = window.innerHeight / 2;
        setX((e.pageX - startPositionX) * speed);
        setY((e.pageY - startPositionY) * speed);
    };

    useEffect(() => {
        headerDispatcher({type: HeaderActionTypes.HIDE_HEADER})

        return () => {
            headerDispatcher({type: HeaderActionTypes.SHOW_HEADER})
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