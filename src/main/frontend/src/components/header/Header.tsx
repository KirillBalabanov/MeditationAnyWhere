import React, {useContext, useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import logo from "../../images/logo.svg";
import {AuthContext} from "../../context/AuthContext";

import defaultAvatar from "../../images/defaultAvatar.svg";
import polygon from "../../images/polygon.svg";
import polygonOnRectangle from "../../images/polygonOnRectangle.svg"
import {CsrfContext} from "../../context/CsrfContext";
import {HeaderReloadContext} from "../../context/HeaderReloadContext";

const Header = () => {
    const headerReloadContext = useContext(HeaderReloadContext)!;

    const authContext = useContext(AuthContext)!;
    const csrfContext = useContext(CsrfContext);
    const [showMenu, setShowMenu] = useState(false);
    let redirect = useNavigate();
    const redirectTo = (path: string) => {
        redirect(path);
    };

    const [avatarUrObj, setAvatarUrlObj] = useState({avatarUrl: ""});
    const [isLoading, setIsLoading] = useState(true);

    // fetch on reload and on page load
    useEffect(() => {
        if (authContext.auth) {
            fetch("/user/profile/avatar/get").then((response) => response.json()).then((data) => {
                setAvatarUrlObj(data);
                setIsLoading(false);
            });
        }
        headerReloadContext.setReload(false);
    }, [headerReloadContext.reload]);

    function logout() {
        fetch("/user/auth/logout", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': csrfContext?.csrfToken!
            }
        }).then((response) => response.text()).then((data) => {
            // set new csrf token generated by server for this session.
            csrfContext?.setToken(data);
        });
        authContext?.setAuth(false);
        authContext?.setUsername("$anonymous");
    }

    return (
        <header className="header">
            <Link to={"/"} className="logo">
                <img src={logo} alt="logo"/>
            </Link>
            {
                authContext?.auth
                    ?
                    isLoading
                        ?
                        <div></div>
                        :
                        <div className="header__box">

                            <div className="header__user" onClick={() => setShowMenu(!showMenu)}>
                                <img src={avatarUrObj.avatarUrl==="" ? defaultAvatar : avatarUrObj.avatarUrl} alt="avatar" className={"header__user-avatar"}/>
                                <img src={polygon} alt="polygon"/>
                            </div>
                            <ul className={showMenu ? "user__menu active" : "user__menu"}>
                                <img src={polygonOnRectangle} alt="polygon" className="user__menu-polygon"/>
                                <li className="user__menu-item">
                                    {authContext.username}
                                </li>
                                <li className="user__menu-item"
                                    onClick={() => redirectTo("/profile/" + authContext?.username)}>
                                    Go to profile
                                </li>
                                <li className="user__menu-item"
                                    onClick={() => redirectTo("/settings/profile")}>
                                    Settings
                                </li>
                                <li className="user__menu-item" onClick={() => {
                                    logout();
                                    redirect("/start");
                                }}>
                                    Log out
                                </li>
                            </ul>
                        </div>
                    :
                    <Link to={"/login"}>log in</Link>
            }
        </header>
    );
};

export default Header;