import React from 'react';
import {useParams} from "react-router-dom";
import classes from "../styles/VerificationPage.module.css";

const VerificationPage = () => {
    let activationCode: string = useParams()["activationCode"]!;
    return (
        <div className={classes.verification}>
            <div className="container">
                <div className={classes.verification__text}>
                    Activated
                </div>
            </div>
        </div>
    );
};

export default VerificationPage;