import React, {FC, useState} from 'react';
import {AuthContext, AuthContextI} from "../context/AuthContext";
import {WrapperInterface} from "./WrapperInterface";
import {useAuth} from "../hooks/useAuth";
import Loader from "../components/loader/Loader";

const AuthWrapper: FC<WrapperInterface> = React.memo(({children}) => {
    const [isLoading, setIsLoading] = useState(true);

    const [auth, setAuth] = useState(false);
    const [username, setUsername] = useState("$anonymous");
    let AuthContextImp: AuthContextI = {
        auth: auth,
        setAuth: setAuth,
        username: username,
        setUsername: setUsername
    }
    useAuth(AuthContextImp, setIsLoading);

    if(isLoading) return (<Loader></Loader>)

    return (
        <AuthContext.Provider value={AuthContextImp}>
            {children}
        </AuthContext.Provider>
    );
});

export default AuthWrapper;