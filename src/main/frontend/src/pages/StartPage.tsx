import React from 'react';
import {Link} from "react-router-dom";

import classes from "../styles/StartPage.module.css";

const StartPage = () => {
    return (
        <div className={classes.bg}>
            <div className="container">
                <div>
                    <h1>Meditation Any Where</h1>
                    <Link to={"/"} className={classes.link}>start</Link>
                </div>
            </div>
        </div>
    );
};

export default StartPage;