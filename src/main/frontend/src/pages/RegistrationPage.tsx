import React, {FormEvent, useContext, useState} from 'react';
import classes from "../styles/AuthPage.module.css";
import {Link} from "react-router-dom";
import {isValidEmail, isValidPassword, isValidUsername} from "../util/Validator";
import {CsrfContext} from "../context/CsrfContext";
import {AuthContext} from "../context/AuthContext";
import {useAuthRedirect} from "../hooks/useAuthRedirect";
import Loader from "../components/loading/Loader";

const RegistrationPage = () => {
    const token = useContext(CsrfContext)?.csrfToken;
    const authContext = useContext(AuthContext);
    const[isLoading, setIsLoading] = useState(false);
    useAuthRedirect(authContext!.auth);

    function postRegister(e: FormEvent) {
        e.preventDefault();
        let children = (e.target as Element).children;
        let username = (children[1] as HTMLInputElement).value;
        let email = (children[2] as HTMLInputElement).value;
        let password = (children[3] as HTMLInputElement).value;
        let errorText = children[4] as HTMLParagraphElement;
        errorText.textContent = "";
        try {
            isValidUsername(username);
            isValidEmail(email)
            isValidPassword(password);
        } catch (e) {
            if(e instanceof Error){
                errorText.textContent = e.message;
            }
            return;
        }
        setIsLoading(true);
        fetch("/registration", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': token!
            },
            body: JSON.stringify({
                "username": username,
                "email": email,
                "password": password
            })
        }).then((response) => response.json()).then((data) => {
            // if server send map "error" -> errorMessage, then show it into the error field
            if("error" in data) errorText.textContent = data["error"];
            // else notify user that registration email was sent
            else {
                errorText.textContent = "Verification email has been sent.";
                // clear inputs
                (children[1] as HTMLInputElement).value = "";
                (children[2] as HTMLInputElement).value = "";
                (children[3] as HTMLInputElement).value = "";
            }
            setIsLoading(false);
        });
    }

    return (
        <div>
            <div className={classes.auth__outer}>
                <form className={classes.auth} onSubmit={postRegister}>
                    <h2 className={classes.auth__title}>Create Account</h2>
                    <input type="text" className={classes.auth__input} placeholder="Input username"/>
                    <input type="text" className={classes.auth__input} placeholder="Input email"/>
                    <input type="password" className={classes.auth__input} placeholder="Input password"/>
                    <p className={classes.auth__error}></p>
                    <div className={classes.auth__btnOuter}>
                        {
                            isLoading
                                ?
                                <Loader/>
                                :
                                <button type="submit" className={classes.auth__btn}>Register</button>
                        }
                    </div>
                    <Link to={"/login"} className={classes.auth__link}>log in</Link>
                </form>
            </div>
        </div>
    );
};

export default RegistrationPage;