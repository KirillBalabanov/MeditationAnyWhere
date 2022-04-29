import {useEffect, useState} from "react";
import {AuthContextI} from "../context/AuthContext";

export const useAuth = () => {
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
        });
    } ,[]);
    return AuthContextImp;
}