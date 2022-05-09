import React, {useContext, useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import logo from "../../images/logo.svg";
import {AuthContext} from "../../context/AuthContext";

import defaultAvatar from "../../images/defaultAvatar.svg";
import polygon from "../../images/polygon.svg";
import polygonOnRectangle from "../../images/polygonOnRectangle.svg"
import {CsrfContext} from "../../context/CsrfContext";
import {AvatarI, CsrfI, ErrorI} from "../../types/types";
import {HeaderContext, HeaderContextI} from "../../context/HeaderContext";
import classes from "./Header.module.css";

const Header = () => {
    const headerContext = useContext<HeaderContextI | null>(HeaderContext)!;

    const authContext = useContext(AuthContext)!;
    const csrfContext = useContext(CsrfContext);
    const [showMenu, setShowMenu] = useState(false);

    let redirect = useNavigate();
    const redirectTo = (path: string) => {
        redirect(path);
    };

    const [avatarUrObj, setAvatarUrlObj] = useState<AvatarI | null>(null);
    const [avatarError, setAvatarError] = useState<ErrorI | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // fetch on reload and on page load
    useEffect(() => {
        if (authContext.auth) {
            fetch("/user/profile/avatar/get").then((response) => response.json()).then((data: AvatarI | ErrorI) => {
                if ("error" in data) {
                    setAvatarError(data);
                    return;
                }
                setAvatarUrlObj(data);
                setIsLoading(false);
            });
        }
        headerContext.setReload(false);
    }, [headerContext.reload]);

    function logout() {
        fetch("/user/auth/logout", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': csrfContext?.csrfToken!
            }
        }).then((response) => response.json()).then((data: CsrfI) => {
            // set new csrf token generated by server for this session.
            csrfContext?.setToken(data.csrf);
        });
        authContext?.setAuth(false);
        authContext?.setUsername("$anonymous");
    }

    return (
        <header className={classes.header} style={{display: headerContext.showHeader ? "flex" : "none"}}>
            <Link to={"/"} className={classes.logo}>
                <img src={logo} alt="logo"/>
            </Link>
            {
                authContext?.auth
                    ?
                    isLoading
                        ?
                        <div></div>
                        :
                        <div className={classes.header__box}>
                            {
                                avatarError != null
                                    ?
                                    <div>{avatarError.error}</div>
                                    :
                                    <div className={classes.header__user} onClick={() => setShowMenu(!showMenu)}>
                                        <img src={avatarUrObj!.avatarUrl==="" ? defaultAvatar : avatarUrObj!.avatarUrl} alt="avatar" className={classes.header__userAvatar}/>
                                        <img src={polygon} alt="polygon"/>
                                    </div>
                            }
                            <ul className={showMenu ? classes.user__menu + " " + classes.active : classes.user__menu}>
                                <img src={polygonOnRectangle} alt="polygon" className={classes.user__menuPolygon}/>
                                <li className={classes.user__menuItem}>
                                    {authContext.username}
                                </li>
                                <li className={classes.user__menuItem}
                                    onClick={() => redirectTo("/profile/" + authContext?.username)}>
                                    Go to profile
                                </li>
                                <li className={classes.user__menuItem}
                                    onClick={() => redirectTo("/settings/profile")}>
                                    Settings
                                </li>
                                <li className={classes.user__menuItem} onClick={() => {
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