import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import classes from "../styles/VerificationPage.module.css";
import {useFetching} from "../hooks/useFetching";
import Loader from "../components/loading/Loader";

const VerificationPage = () => {
    let activationCode: string = useParams()["activationCode"]!;
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({message: ""});

    useFetching("/verification/" + activationCode, setData, setIsLoading);

    return (
        <div className={classes.verification}>
            <div className="container">
                <div className={classes.verification__text}>
                    {
                        isLoading
                            ?
                            <Loader></Loader>
                            :
                            data["message"].toString()
                    }
                </div>
            </div>
        </div>
    );
};

export default VerificationPage;