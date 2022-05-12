import {AuthContextI} from "../context/AuthContext";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export const usePrivateRouteRedirect = (authContext: AuthContextI) => {
    let navigateFunction = useNavigate();
    useEffect(() => {
        if(!authContext.auth) {
            navigateFunction("/login");
        }
    }, [authContext.auth]);
};