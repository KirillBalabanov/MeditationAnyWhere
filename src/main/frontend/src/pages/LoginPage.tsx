import React, {FormEvent, useContext, useEffect, useState} from 'react';
import classes from "../styles/AuthPage.module.css";
import {Link, useNavigate} from "react-router-dom";
import {isValidPassword, isValidUsername} from "../util/Validator";
import {AuthContext} from "../context/AuthContext";
import {CsrfContext} from "../context/CsrfContext";
import Loader from "../components/loading/Loader";

const LoginPage = () => {
    const csrfContext = useContext(CsrfContext)!;
    let authContext = useContext(AuthContext)!;
    const [isLoading, setIsLoading] = useState(false);
    let navigateFunction = useNavigate();
    useEffect(() => {
        if(authContext.auth) navigateFunction("/");
    }, [authContext.auth]);

    function postLogin(e: FormEvent) {
        e.preventDefault();
        let children = (e.target as Element).children;
        let username = (children[1] as HTMLInputElement).value;
        let password = (children[2] as HTMLInputElement).value;
        let errorText = children[3] as HTMLParagraphElement;
        errorText.textContent = "";
        try {
            isValidUsername(username);
            isValidPassword(password);
        } catch (e) {
            if(e instanceof Error){
                errorText.textContent = e.message;
            }
            return;
        }
        setIsLoading(true);
        fetch("/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': csrfContext.csrfToken
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        }).then((response) => response.json()).then((data) => {
            // if server send map "error" -> errorMessage, then show it into the error field
            if("error" in data) {
                errorText.textContent = data["error"];
            }
            else {
                authContext.setAuth(true);
                authContext.setUsername(data["username"]);
                csrfContext.setToken(data["csrf"]);
            }
            // for animation
            setTimeout(() => {
                setIsLoading(false);
            }, 300);
        });
    }

    return (
        <div>
            <div className={classes.auth__outer} >
                <form className={isLoading ? classes.auth + " " + classes.loading : classes.auth} onSubmit={postLogin}>
                    <h2 className={classes.auth__title}>Log in</h2>
                    <input type="text" className={classes.auth__input} placeholder="Input username"/>
                    <input type="password" className={classes.auth__input} placeholder="Input password"/>
                    <p className={classes.auth__error}></p>
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