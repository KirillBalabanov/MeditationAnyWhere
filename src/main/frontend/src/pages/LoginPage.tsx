import React, {FormEvent, useContext} from 'react';
import classes from "../styles/AuthPage.module.css";
import {Link, Navigate} from "react-router-dom";
import {isValidPassword, isValidUsername} from "../util/Validator";
import {useToken} from "../hooks/useToken";
import {useAuth} from "../hooks/useAuth";
import {AuthContext} from "../context/AuthContext";
import {CsrfContext} from "../context/CsrfContext";

const LoginPage = () => {
    const token = useContext(CsrfContext)!.csrfToken;
    let authContextI = useContext(AuthContext)!;

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

        fetch("/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': token
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        }).then((response) => response.json()).then((data) => {
            console.log("{here");
            // if server send map "error" -> errorMessage, then show it into the error field
            if("error" in data) errorText.textContent = data["error"];
            else {
                authContextI.setAuth(true);
                authContextI.setUsername(data["username"]);
            }
        });
    }

    return (
        <div>
            <div className={classes.auth__outer}>
                <form className={classes.auth} onSubmit={postLogin}>
                    <h3 className={classes.auth__title}>Log in</h3>
                    <input type="text" className={classes.auth__input} placeholder="Input username"/>
                    <input type="password" className={classes.auth__input} placeholder="Input password"/>
                    <p className={classes.auth__error}></p>
                    <button type="submit" className={classes.auth__btn}>Log in</button>
                    <Link to={"/registration"} className={classes.auth__link}>register</Link>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;