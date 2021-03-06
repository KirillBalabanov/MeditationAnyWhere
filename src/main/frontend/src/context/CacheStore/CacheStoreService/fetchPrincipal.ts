import React, {SetStateAction} from "react";
import {StoreContextI} from "../StoreContext";
import {AuthActionTypes} from "../../../reducer/authReducer";
import {PrincipalI} from "../../../types/serverTypes";
import {UserActionTypes} from "../../../reducer/userReducer";

export const fetchPrincipal = (cacheStore: StoreContextI, setIsLoading: React.Dispatch<SetStateAction<boolean>> | null = null) => {
    fetch("/api/server/principal").then((response) => {
        return response.json()
    }).then((obj: PrincipalI) => {
        const authReducer = cacheStore.authReducer;
        const userReducer = cacheStore.userReducer;

        authReducer[1]({type: AuthActionTypes.LOGIN})
        userReducer[1]({type: UserActionTypes.SET_PRINCIPAL, payload: obj})

    }).catch(() => { // if null - not authenticated
        cacheStore.authReducer[1]({type: AuthActionTypes.LOGOUT})
        cacheStore.userReducer[1]({type: UserActionTypes.RESET_ALL})
    }).then(() => {
        if (setIsLoading !== null) {
            setIsLoading(false);
        }
    });
};