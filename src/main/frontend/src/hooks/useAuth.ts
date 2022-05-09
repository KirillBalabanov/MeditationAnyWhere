import {AuthContextI} from "../types/types";


export const useAuth = (AuthContextImp: AuthContextI, setIsLoading: (loading: boolean) => void) => {
    fetch("/server/principal").then((response) => response.json()).then((obj) => {
        AuthContextImp.setAuth(obj["authenticated"]);
        AuthContextImp.setUsername(obj["username"]);
        setIsLoading(false);
    });
};