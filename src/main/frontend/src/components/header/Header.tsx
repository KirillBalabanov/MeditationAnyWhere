import React, {FC, useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import logo from "../../images/logo.svg";

import defaultAvatar from "../../images/defaultAvatar.svg";
import polygon from "../../images/polygon.svg";
import polygonOnRectangle from "../../images/polygonOnRectangle.svg"
import classes from "./Header.module.css";
import {useStore} from "../../context/CacheStore/StoreContext";
import {logoutUser} from "../../context/CacheStore/CacheStoreService/logoutUser";
import {csrfFetching, FetchingMethods} from "../../util/Fetch/csrfFetching";

const Header: FC = React.memo(() => {
    const cacheStore = useStore()!;
    const [authState] = cacheStore.authReducer;
    const [userState,] = cacheStore.userReducer;
    const [headerState] = cacheStore.headerReducer;

    const [showMenu, setShowMenu] = useState(false);

    const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);

    let redirect = useNavigate();
    const redirectTo = (path: string) => {
        setShowMenu(false);
        redirect(path);
    };

    useEffect(() => {
        if (userState.avatar !== null) {
            setIsLoadingAvatar(false);
        }
        else if (!authState.auth) {
            setIsLoadingAvatar(false);
        }
    }, [userState.avatar]); // eslint-disable-line react-hooks/exhaustive-deps

    function logout() {
        if (!authState.auth) return;

        csrfFetching("/api/users/auth/logout", FetchingMethods.POST, null, null).then(() => logoutUser(cacheStore));
    }

    return (

        <header className={classes.header} style={{display: headerState.showHeader ? "block" : "none"}}>
            <div className="container">
                <div className={classes.headerInner}>
                    <Link to={"/"} className={classes.logo}>
                        <img src={logo} alt="logo" className={classes.logoImg}/>
                    </Link>
                    {
                        authState.auth
                            ?
                            <div className={classes.header__box} style={{display: isLoadingAvatar ? "none" : "flex"}}>
                                {
                                    <div className={classes.header__user} onClick={() => {
                                        setShowMenu(prev => !prev);
                                    }}>
                                        <img src={userState.avatar === null || userState.avatar.url === null ? defaultAvatar : userState.avatar.url} alt="avatar" className={classes.header__userAvatar}/>
                                        <img src={polygon} alt="polygon"/>
                                    </div>
                                }
                                <ul className={showMenu ? classes.user__menu + " " + classes.active : classes.user__menu}>
                                    <img src={polygonOnRectangle} alt="polygon" className={classes.user__menuPolygon}/>
                                    <li className={classes.user__menuItem}>
                                        {userState.username}
                                    </li>
                                    <Link to={"/profile/" + userState.username} className={classes.user__menuItem} onClick={() => setShowMenu(false)}>
                                        Go to profile
                                    </Link>
                                    <Link to={"/settings/profile"} className={classes.user__menuItem} onClick={() => setShowMenu(false)}>
                                        Settings
                                    </Link>
                                    <li className={classes.user__menuItem} onClick={() => {
                                        logout();
                                        redirectTo("/start");
                                    }}>
                                        Log out
                                    </li>
                                </ul>
                            </div>
                            :
                            <Link to={"/login"} className={classes.headerLink}>log in</Link>
                    }
                </div>
            </div>
        </header>
    );
});

export default Header;