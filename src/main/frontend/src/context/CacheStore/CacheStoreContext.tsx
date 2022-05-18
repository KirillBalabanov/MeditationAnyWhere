import React, {createContext, Dispatch, FC, useContext, useReducer, useState} from 'react';
import {ContextProviderInterface} from "../ContextProviderInterface";
import Loader from "../../components/loader/Loader";
import {useGetPrincipal} from "../../hooks/useRefteshAuth";
import {AuthAction, authReducer, AuthState} from "../../reducer/authReducer";
import {HeaderAction, headerReducer, HeaderState} from "../../reducer/headerReducer";
import {UserAction, userReducer, UserState} from "../../reducer/userReducer";
import {ServerAction, serverReducer, ServerState} from "../../reducer/serverReducer";


const authReducerInit: AuthState = {
    auth: false,
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
    const headerReducerImp: [HeaderState, Dispatch<HeaderAction>] = useReducer(headerReducer, headerReducerInit);
    const userReducerImp: [UserState, Dispatch<UserAction>] = useReducer(userReducer, userReducerInit);
    const serverReducerImp: [ServerState, Dispatch<ServerAction>] = useReducer(serverReducer, serverReducerInit);

    const cacheStoreContextImp: CacheStoreContextI = {
        authReducer: authReducerImp,
        headerReducer: headerReducerImp,
        userReducer: userReducerImp,
        serverReducer: serverReducerImp,
    }
    // get principal
    useGetPrincipal(cacheStoreContextImp, setIsLoadingPrincipal);

    if(isLoadingPrincipal) return (<Loader></Loader>)

    return (
        <CacheStoreContext.Provider value={cacheStoreContextImp}>
            {children}
        </CacheStoreContext.Provider>
    );
};