import React from 'react';
import classes from "../styles/AuthPage.module.css";
import {Link} from "react-router-dom";

const LoginPage = () => {
    function postLogin(e: React.FormEvent) {
        e.preventDefault();

    }
    
    return (
        <div>
            <div className={classes.auth__outer}>
                <form className={classes.auth} onSubmit={postLogin}>
                    <h3 className={classes.auth__title}>Log in</h3>
                    <input type="text" className={classes.auth__input} placeholder="Input username"/>
                    <input type="password" className={classes.auth__input} placeholder="Input password"/>
                    <button type="submit" className={classes.auth__btn}>Log in</button>
                    <Link to={"/registration"} className={classes.auth__link}>register</Link>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;