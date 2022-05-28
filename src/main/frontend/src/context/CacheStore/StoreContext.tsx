import React, {createContext, Dispatch, FC, useContext, useEffect, useReducer, useState} from 'react';
import {ContextProviderInterface} from "../ContextProviderInterface";
import Loader from "../../components/loader/Loader";
import {AuthAction, authReducer, AuthState} from "../../reducer/authReducer";
import {HeaderAction, headerReducer, HeaderState} from "../../reducer/headerReducer";
import {UserAction, userReducer, UserState} from "../../reducer/userReducer";
import {ServerAction, serverReducer, ServerState} from "../../reducer/serverReducer";
import {useLocation} from "react-router-dom";
import {fetchPrincipal} from "./CacheStoreService/fetchPrincipal";


const authReducerInit: AuthState = {
    auth: false,
}

const headerReducerInit: HeaderState = {
    showHeader: true,
    reloadHeader: false,
}

const userReducerInit: UserState = {
    username: null,
    email: null,
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

export interface StoreContextI {
    authReducer: [AuthState, Dispatch<AuthAction>],
    headerReducer: [HeaderState, Dispatch<HeaderAction>],
    userReducer: [UserState, Dispatch<UserAction>],
    serverReducer: [ServerState, Dispatch<ServerAction>],
}

const StoreContext = createContext<StoreContextI | null>(null);

export const useStore = () => {
    return useContext(StoreContext);
}

export const StoreProvider: FC<ContextProviderInterface> = ({children}) => {
    const [isLoadingPrincipal, setIsLoadingPrincipal] = useState(true);

    const authReducerImp: [AuthState, Dispatch<AuthAction>] = useReducer(authReducer, authReducerInit);
    const headerReducerImp: [HeaderState, Dispatch<HeaderAction>] = useReducer(headerReducer, headerReducerInit);
    const userReducerImp: [UserState, Dispatch<UserAction>] = useReducer(userReducer, userReducerInit);
    const serverReducerImp: [ServerState, Dispatch<ServerAction>] = useReducer(serverReducer, serverReducerInit);

    const storeContextI: StoreContextI = {
        authReducer: authReducerImp,
        headerReducer: headerReducerImp,
        userReducer: userReducerImp,
        serverReducer: serverReducerImp,
    }

    let location = useLocation();

    useEffect(() => {
        // fetch principal on route change
        fetchPrincipal(storeContextI, setIsLoadingPrincipal);
    }, [location]); // eslint-disable-line react-hooks/exhaustive-deps



    if(isLoadingPrincipal) return (<Loader></Loader>)

    return (
        <StoreContext.Provider value={storeContextI}>
            {children}
        </StoreContext.Provider>
    );
};