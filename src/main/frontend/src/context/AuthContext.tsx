import React, {createContext, FC, SetStateAction, useContext, useEffect, useState} from "react";
import {ContextProviderInterface} from "./ContextProviderInterface";
import Loader from "../components/loader/Loader";

export interface AuthContextI {
    auth: boolean,
    setAuth: (auth: boolean) => void,
    username: string,
    setUsername: (username: string) =>  void,
}

const AuthContext = createContext<AuthContextI | null>(null);

export const useAuthContext = () => {
    return useContext(AuthContext);
};

export const useRefreshAuthContext = (context: AuthContextI, setIsLoading: React.Dispatch<SetStateAction<boolean>> | null = null) => {
    useEffect(() => {
        fetch("/server/principal").then((response) => {
            return response.json()
        }).then((obj) => {
            context.setAuth(obj["authenticated"]);
            context.setUsername(obj["username"]);
            if (setIsLoading !== null) {
                setIsLoading(false);
            }
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

export const AuthContextProvider: FC<ContextProviderInterface> = ({children}) => {
    const [isLoading, setIsLoading] = useState(true);

    const [auth, setAuth] = useState(false);
    const [username, setUsername] = useState("$anonymous");
    let AuthContextImp: AuthContextI = {
        auth: auth,
        setAuth: setAuth,
        username: username,
        setUsername: setUsername
    }

    useRefreshAuthContext(AuthContextImp, setIsLoading);

    if(isLoading) return (<Loader></Loader>)

    return (
        <AuthContext.Provider value={AuthContextImp}>
            {children}
        </AuthContext.Provider>
    )
};