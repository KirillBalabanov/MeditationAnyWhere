import React, {FormEvent, useContext, useEffect, useState} from 'react';
import classes from "../styles/AuthPage.module.css";
import {Link, useNavigate} from "react-router-dom";
import {isValidPassword, isValidUsername} from "../util/UserValidator";
import {AuthContext} from "../context/AuthContext";
import {CsrfContext} from "../context/CsrfContext";
import Loader from "../components/loader/Loader";
import {useAuthRedirect} from "../hooks/useAuthRedirect";

const LoginPage = () => {
    const csrfContext = useContext(CsrfContext)!;
    let authContext = useContext(AuthContext)!;

    // animation states
    const [isLoading, setIsLoading] = useState(false);
    const [authClasses, setAuthClasses] = useState([classes.auth]);
    const [redirect, setRedirect] = useState(false);

    const [errorMsg, setErrorMsg] = useState("");

    useAuthRedirect(authContext.auth);

    // navigate on successful log in
    let navigateFunction = useNavigate();
    useEffect(() => {
        if(redirect) {
            setTimeout(() => {
                navigateFunction("/");
            }, 1200);
        }
    }, [redirect]);

    function postLogin(e: FormEvent) {
        e.preventDefault();
        let children = (e.target as Element).children;
        let username = (children[1] as HTMLInputElement).value;
        let password = (children[2] as HTMLInputElement).value;
        let errorText = children[3] as HTMLParagraphElement;
        try {
            isValidUsername(username);
            isValidPassword(password);
            errorText.textContent = "";
        } catch (e) {
            if(e instanceof Error){
                errorText.textContent = e.message;
            }
            return;
        }
        setAuthClasses([...authClasses, classes.loading]);
        setIsLoading(true);
        fetch("/login", { method: "POST", headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': csrfContext.csrfToken
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        }).then((response) => response.json()).then((data) => {
            let failed: boolean = false;
            if("error" in data) {
                errorText.textContent = data["error"];
                failed = true;
            }
            else {
                authContext.setAuth(true);
                authContext.setUsername(data["username"]);
                csrfContext.setToken(data["csrf"]);
                setRedirect(true);
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
                <form className={authClasses.join(" ").trim()} onSubmit={postLogin}>
                    <h2 className={classes.auth__title}>Log in</h2>

                    <input type="text" className={classes.auth__input} placeholder="Input username"
                           onInput={(e) => { // validation on input
                               try{
                                   isValidUsername((e.target as HTMLInputElement).value);
                                   setErrorMsg("");
                               } catch (e) {
                                   if(e instanceof Error) setErrorMsg(e.message);
                               }
                           }}/>

                    <input type="password" className={classes.auth__input} placeholder="Input password"
                           onInput={(e) => { // validation on input
                               try{
                                   isValidPassword((e.target as HTMLInputElement).value);
                                   setErrorMsg("");
                               } catch (e) {
                                   if(e instanceof Error) setErrorMsg(e.message);
                               }
                           }}/>
                    <p className={classes.auth__error}>{errorMsg}</p>
                    {
                        isLoading
                        &&
                        <Loader/>
                    }
                    <button type="submit" className={classes.auth__btn}>Log in</button>
                    <Link to={"/registration"} className={classes.auth__link}>register</Link>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;