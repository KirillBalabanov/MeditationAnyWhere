import React, {FormEvent, useContext, useEffect} from 'react';
import classes from "../styles/AuthPage.module.css";
import {Link, useNavigate} from "react-router-dom";
import {isValidPassword, isValidUsername} from "../util/Validator";
import {AuthContext} from "../context/AuthContext";
import {CsrfContext} from "../context/CsrfContext";
import {useAuthRedirect} from "../hooks/useAuthRedirect";

const LoginPage = () => {
    const token = useContext(CsrfContext)!;
    let authContext = useContext(AuthContext)!;

    useAuthRedirect(authContext.auth);

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
        console.log(token.csrfToken);
        fetch("/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': token.csrfToken
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
                authContext.setAuth(true);
                authContext.setUsername(data["username"]);
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