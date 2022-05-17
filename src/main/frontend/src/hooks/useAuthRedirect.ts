import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export const useAuthRedirect = (auth: boolean) => {
    // if user is logged in, redirect to main page
    let navigateFunction = useNavigate();
    useEffect(() => {
        if(auth) navigateFunction("/");
    }, [navigateFunction, auth]);
};