import React, {createContext, Dispatch, FC, useContext, useEffect, useReducer, useState} from 'react';
import {ContextProviderInterface} from "../ContextProviderInterface";
import Loader from "../../components/loader/Loader";
import {useGetPrincipal} from "../../hooks/useRefteshAuth";
import {AuthAction, authReducer, AuthState} from "../../reducer/authReducer";
import {CsrfAction, CsrfActionTypes, csrfReducer, CsrfState} from "../../reducer/csrfReducer";
import {HeaderAction, headerReducer, HeaderState} from "../../reducer/headerReducer";
import {UserAction, userReducer, UserState} from "../../reducer/userReducer";
import {ServerAction, serverReducer, ServerState} from "../../reducer/serverReducer";


const authReducerInit: AuthState = {
    auth: false,
}

const csrfReducerInit: CsrfState = {
    csrfToken: null,
}

const headerReducerInit: HeaderState = {
    showHeader: true,
    reloadHeader: false,
}

const userReducerInit: UserState = {
    username: null,
    bio: null,
    avatar: null,
    registrationDate: null,
    audio: null,
    stats: null,
}

const serverReducerInit: ServerState = {
    toggleAudio: null,
    defaultAudio: null,
}

export interface CacheStoreContextI {
    authReducer: [AuthState, Dispatch<AuthAction>],
    csrfReducer: [CsrfState, Dispatch<CsrfAction>],
    headerReducer: [HeaderState, Dispatch<HeaderAction>],
    userReducer: [UserState, Dispatch<UserAction>],
    serverReducer: [ServerState, Dispatch<ServerAction>],
}

const CacheStoreContext = createContext<CacheStoreContextI | null>(null);

export const useCacheStore = () => {
    return useContext(CacheStoreContext);
}

export const CacheStoreProvider: FC<ContextProviderInterface> = ({children}) => {
    const [isLoadingPrincipal, setIsLoadingPrincipal] = useState(true);

    const authReducerImp: [AuthState, Dispatch<AuthAction>] = useReducer(authReducer, authReducerInit);
    const csrfReducerImp: [CsrfState, Dispatch<CsrfAction>] = useReducer(csrfReducer, csrfReducerInit);
    const headerReducerImp: [HeaderState, Dispatch<HeaderAction>] = useReducer(headerReducer, headerReducerInit);
    const userReducerImp: [UserState, Dispatch<UserAction>] = useReducer(userReducer, userReducerInit);
    const serverReducerImp: [ServerState, Dispatch<ServerAction>] = useReducer(serverReducer, serverReducerInit);

    const cacheStoreContextImp: CacheStoreContextI = {
        authReducer: authReducerImp,
        csrfReducer: csrfReducerImp,
        headerReducer: headerReducerImp,
        userReducer: userReducerImp,
        serverReducer: serverReducerImp,
    }

    // get token from cookies.
    useEffect(() => {
        let token = document.cookie.replace("^XSRF-TOKEN", '').replace("XSRF-TOKEN=", "");
        csrfReducerImp[1]({type: CsrfActionTypes.SET_TOKEN, payload: token})

    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    // get principal
    useGetPrincipal(cacheStoreContextImp, setIsLoadingPrincipal);


    if(isLoadingPrincipal) return (<Loader></Loader>)
    userReducerImp.forEach(el => console.log(el));
    return (
        <CacheStoreContext.Provider value={cacheStoreContextImp}>
            {children}
        </CacheStoreContext.Provider>
    );
};