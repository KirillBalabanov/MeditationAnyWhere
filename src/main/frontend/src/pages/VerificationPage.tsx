import React, {useState} from 'react';
import {Link, useParams} from "react-router-dom";
import classes from "../styles/VerificationPage.module.css";
import {useFetching} from "../hooks/useFetching";
import Loader from "../components/loader/Loader";
import {ErrorI, VerificationI} from "../types/types";

const VerificationPage = () => {
    let activationCode: string = useParams()["activationCode"]!;
    const [isLoading, setIsLoading] = useState(true);

    const [verificationData, setVerificationData] = useState<VerificationI | null | ErrorI>(null);

    const fetched = useFetching<VerificationI | ErrorI>("/user/auth/verification/" + activationCode, setIsLoading, setVerificationData);

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
                                    fetched
                                        ?
                                        <p>{verificationData != null && "message" in verificationData && verificationData.message}</p>
                                        :
                                        <p>{verificationData != null && "error" in verificationData && verificationData.error}</p>
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