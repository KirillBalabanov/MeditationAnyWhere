import React, {SetStateAction, useEffect} from "react";
import {CacheStoreContextI} from "../context/CacheStore/CacheStoreContext";
import {AuthActionTypes} from "../reducer/authReducer";
import {PrincipalI} from "../types/serverTypes";
import {UserActionTypes} from "../reducer/userReducer";

export const useGetPrincipal = (cacheStore: CacheStoreContextI, setIsLoading: React.Dispatch<SetStateAction<boolean>> | null = null) => {
    useEffect(() => {
        fetch("/server/principal").then((response) => {
            return response.json()
        }).then((obj: PrincipalI) => {
            const authReducer = cacheStore.authReducer;
            const userReducer = cacheStore.userReducer;

            if (obj.authenticated) {
                authReducer[1]({type: AuthActionTypes.LOGIN})
                userReducer[1]({type: UserActionTypes.SET_USERNAME, payload: obj.username})
            } else {
                authReducer[1]({type: AuthActionTypes.LOGOUT})
                userReducer[1]({type: UserActionTypes.RESET_ALL})
            }

            if (setIsLoading !== null) {
                setIsLoading(false);
            }
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
};