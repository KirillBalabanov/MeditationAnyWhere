import {AuthContextI} from "../context/AuthContext";
import {useEffect} from "react";


export const useAuth = (AuthContextImp: AuthContextI, setIsLoading: (loading: boolean) => void) => {
    useEffect(() => {
        fetch("/server/principal").then((response) => response.json()).then((obj) => {
            AuthContextImp.setAuth(obj["authenticated"]);
            AuthContextImp.setUsername(obj["username"]);
            setIsLoading(false);
        });
    }, []);
};