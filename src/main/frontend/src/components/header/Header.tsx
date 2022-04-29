import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import logo from "../../images/logo.svg";
import classes from "./Header.module.css";
import {AuthContext} from "../../context/AuthContext";

const Header = () => {

    const authenticated = useContext(AuthContext)?.auth;
    return (
        <header className={classes.header}>
            <Link to={"/main"} className={classes.logo}>
                <img src={logo} alt="logo"/>
            </Link>

            <div className={classes.header__box}>
                {authenticated
                    ?
                    <Link to={"/profile/"}>
                        username
                    </Link>
                    :
                    <Link to={"/login"}>
                        login
                    </Link>
                }
            </div>
        </header>
    );
};

export default Header;