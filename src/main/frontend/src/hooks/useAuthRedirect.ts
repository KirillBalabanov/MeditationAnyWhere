import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {AuthContextI} from "../context/AuthContext";

export const useAuthRedirect = (authContext: AuthContextI) => {
    // if user is logged in, redirect to /
    let navigateFunction = useNavigate();
    useEffect(() => {
        if(authContext?.auth) navigateFunction("/");
    }, [authContext?.auth]);
};