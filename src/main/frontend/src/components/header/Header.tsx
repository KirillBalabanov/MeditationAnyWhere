import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import logo from "../../images/logo.svg";

import defaultAvatar from "../../images/defaultAvatar.svg";
import polygon from "../../images/polygon.svg";
import polygonOnRectangle from "../../images/polygonOnRectangle.svg"
import classes from "./Header.module.css";
import {useCacheStore} from "../../context/CacheStore/CacheStoreContext";
import {AvatarFetchI, ErrorFetchI} from "../../types/serverTypes";
import {UserActionTypes} from "../../reducer/userReducer";
import {logoutUser} from "../../context/CacheStore/CacheStoreService/logoutUser";
import {csrfFetching, FetchingMethods} from "../../util/Fetch/csrfFetching";

const Header = () => {
    const cacheStore = useCacheStore()!;
    const [authState] = cacheStore.authReducer;
    const [userState, userDispatcher] = cacheStore.userReducer;
    const [headerState] = cacheStore.headerReducer;

    const [showMenu, setShowMenu] = useState(false);

    const [isLoadingAvatar, setIsLoadingAvatar] = useState(true);

    let redirect = useNavigate();
    const redirectTo = (path: string) => {
        setShowMenu(false);
        redirect(path);
    };

    useEffect(() => {
        setShowMenu(false);
        setIsLoadingAvatar(true);
        if(userState.avatar !== null){
            setIsLoadingAvatar(false);
            return;
        } // in cache

        if (authState.auth) {
            fetch("/user/profile/avatar/get").then((response) => response.json()).then((data: AvatarFetchI | ErrorFetchI) => {
                if ("errorMsg" in data) {
                    return;
                }
                userDispatcher({type: UserActionTypes.SET_AVATAR, payload: {url: data.avatarUrl}})
                setIsLoadingAvatar(false);
            });
        }
    }, [headerState.reloadHeader]);

    function logout() {
        if (!authState.auth) return;

        csrfFetching("/user/auth/logout", FetchingMethods.POST, null, null).then(() => logoutUser(cacheStore));


    }

    return (
        <header className={classes.header} style={{display: headerState.showHeader ? "flex" : "none"}}>
            <Link to={"/"} className={classes.logo}>
                <img src={logo} alt="logo"/>
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
                                <li className={classes.user__menuItem}
                                    onClick={() => redirectTo("/profile/" + userState.username)}>
                                    Go to profile
                                </li>
                                <li className={classes.user__menuItem}
                                    onClick={() => redirectTo("/settings/profile")}>
                                    Settings
                                </li>
                                <li className={classes.user__menuItem} onClick={() => {
                                    logout();
                                    redirectTo("/start");
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