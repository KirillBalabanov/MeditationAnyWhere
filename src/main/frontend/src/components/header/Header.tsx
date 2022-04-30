import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import logo from "../../images/logo.svg";
import {AuthContext} from "../../context/AuthContext";

const Header = () => {

    const authContext = useContext(AuthContext);
    return (
        <header className="header">
            <Link to={"/"} className="logo">
                <img src={logo} alt="logo"/>
            </Link>

            <div className="header__box">
                {authContext?.auth
                    ?
                    <Link to={"/profile/" + authContext.username}>
                        {authContext.username}
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