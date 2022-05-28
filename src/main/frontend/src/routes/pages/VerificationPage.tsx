import React, {FC, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import classes from "../styles/VerificationPage.module.css";
import {useFetching} from "../../hooks/useFetching";
import Loader from "../../components/loader/Loader";
import {ErrorFetchI, VerificationFetchI} from "../../types/serverTypes";

const VerificationPage: FC = () => {
    let activationCode: string = useParams()["activationCode"]!;
    const [isLoading, setIsLoading] = useState(true);

    const [verificationData, setVerificationData] = useState<VerificationFetchI | null | ErrorFetchI>(null);

    useFetching<VerificationFetchI | ErrorFetchI | null>("/users/auth/verification?code=" + activationCode, setIsLoading, setVerificationData);

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
                                {
                                        verificationData != null && (
                                        "message" in verificationData
                                        ?
                                        <p>{verificationData.message}</p>
                                        :
                                        <p>{verificationData.errorMsg}</p> )
                                }
                                <Link to={"/login"} className={classes.verification__link}>Go to login page</Link>
                            </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default VerificationPage;