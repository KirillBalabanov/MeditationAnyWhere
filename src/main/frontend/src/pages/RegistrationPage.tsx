import React, {FormEvent, useContext, useState} from 'react';
import classes from "../styles/AuthPage.module.css";
import {Link} from "react-router-dom";
import {isValidEmail, isValidPassword, isValidUsername} from "../util/UserValidator";
import {CsrfContext} from "../context/CsrfContext";
import {AuthContext} from "../context/AuthContext";
import {useAuthRedirect} from "../hooks/useAuthRedirect";
import Loader from "../components/loader/Loader";

const RegistrationPage = () => {
    const token = useContext(CsrfContext)?.csrfToken;
    const authContext = useContext(AuthContext);

    // animation states
    const [isLoading, setIsLoading] = useState(false);
    const [authClasses, setAuthClasses] = useState([classes.auth]);

    const [errorMsg, setErrorMsg] = useState("");

    // redirect in case user is logged in and trying to reach this page
    useAuthRedirect(authContext!.auth);

    function postRegister(e: FormEvent) {
        e.preventDefault();
        let children = (e.target as Element).children;
        let username = (children[1] as HTMLInputElement).value;
        let email = (children[2] as HTMLInputElement).value;
        let password = (children[3] as HTMLInputElement).value;
        try {
            isValidUsername(username);
            isValidEmail(email)
            isValidPassword(password);
            setErrorMsg("");
        } catch (e) {
            if(e instanceof Error){
                setErrorMsg(e.message);
            }
            return;
        }
        setAuthClasses([...authClasses, classes.loading]);
        setIsLoading(true);
        fetch("/user/auth/registration", {
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
            let failed:boolean = false;
            if("error" in data) {
                setErrorMsg(data["error"]);
                failed = true;
            }
            else {
                setErrorMsg("Verification email has been sent.");
                // clear inputs
                (children[1] as HTMLInputElement).value = "";
                (children[2] as HTMLInputElement).value = "";
                (children[3] as HTMLInputElement).value = "";
            }
            // animation
            setTimeout(() => {
                setAuthClasses(authClasses.filter((c) => c !== classes.loading));
                setIsLoading(false);
                if (failed) {
                    setAuthClasses([...authClasses, classes.failed]);
                } else {
                    setAuthClasses([...authClasses, classes.succeed]);
                }
                setTimeout(() => {
                    setAuthClasses(authClasses.filter((c) => c !== classes.failed || c !== classes.succeed));
                }, 500); // timeout for animation
            }, 300); // set timeout in case fetch request is very fast.
        });
    }

    return (
        <div>
            <div className={classes.auth__outer}>
                <form className={authClasses.join(" ").trim()} onSubmit={postRegister}>
                    <h2 className={classes.auth__title}>Create Account</h2>
                    <input type="text" name="username" className={classes.auth__input} placeholder="Input username"
                           onInput={(e) => { // validation on input
                                try {
                                    isValidUsername((e.target as HTMLInputElement).value);
                                    setErrorMsg("");
                                } catch (e) {
                                    if (e instanceof Error) setErrorMsg(e.message);
                                }
                    }}/>
                    <input type="email" name="email" className={classes.auth__input} placeholder="Input email"
                           onInput={(e) => { // validation on input
                                try {
                                    isValidEmail((e.target as HTMLInputElement).value);
                                    setErrorMsg("");
                                } catch (e) {
                                    if (e instanceof Error) setErrorMsg(e.message);
                                }
                    }}/>
                    <input type="password" name="password" className={classes.auth__input} placeholder="Input password"
                           onInput={(e) => { // validation on input
                                try {
                                    isValidPassword((e.target as HTMLInputElement).value);
                                    setErrorMsg("");
                                } catch (e) {
                                    if (e instanceof Error) setErrorMsg(e.message);
                                }
                    }}/>
                    <p className={classes.auth__error}>{errorMsg}</p>
                    <div className={classes.auth__btnOuter}>
                        {
                            isLoading
                            &&
                            <Loader/>
                        }
                        <button type="submit" className={classes.auth__btn}>Register</button>
                    </div>
                    <Link to={"/login"} className={classes.auth__link}>log in</Link>
                </form>
            </div>
        </div>
    );
};

export default RegistrationPage;