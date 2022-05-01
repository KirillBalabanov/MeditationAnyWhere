import React, {useState} from 'react';
import {Link, useParams} from "react-router-dom";
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
                <div>
                    {
                        isLoading
                            ?
                            <Loader></Loader>
                            :
                            <div className={classes.verification__box}>
                                <p>{data["message"].toString()}</p>
                                <Link to={"/"} className={classes.verification__link}>Go to main page</Link>
                            </div>

                    }
                </div>
            </div>
        </div>
    );
};

export default VerificationPage;