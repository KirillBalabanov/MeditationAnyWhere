import {useEffect, useState} from "react";
import {AuthContextI} from "../context/AuthContext";

export const useAuth = (setLoading?: (loading: boolean) => void) => {
    const [auth, setAuth] = useState(false);
    const [username, setUsername] = useState("$anonymous");
    const AuthContextImp: AuthContextI = {
        auth,
        setAuth,
        username,
        setUsername
    }

    useEffect(() => {
        fetch("/principal").then((response) => response.json()).then((obj) => {
            setAuth(obj["authenticated"]);
            setUsername(obj["username"]);
            if (setLoading) {
                setLoading(false);
            }
        });
    } ,[]);

    return AuthContextImp;
}