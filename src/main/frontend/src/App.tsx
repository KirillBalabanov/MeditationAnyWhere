import React, {FC, useState} from 'react';
import './styles/App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AuthContext, AuthContextI} from "./context/AuthContext";
import {CsrfContext, CsrfContextI} from "./context/CsrfContext";
import {AppRoutes} from "./routes/Routes";
import {useAuth} from "./hooks/useAuth";
import {useToken} from "./hooks/useToken";
import Loader from "./components/loading/Loader";


const App:FC = () => {
    const [isLoading, setIsLoading] = useState(true);

    const [auth, setAuth] = useState(false);
    const [username, setUsername] = useState("$anonymous");
    let AuthContextImp: AuthContextI = {
        auth,
        setAuth,
        username,
        setUsername
    }
    const [token, setToken] = useState("$token");
    const CsrfContextImp: CsrfContextI = {
        "csrfToken": token,
        setToken: setToken
    }

    useToken(CsrfContextImp);
    useAuth(AuthContextImp, setIsLoading);

    if (isLoading) return (<Loader></Loader>)

    return (
        <CsrfContext.Provider value={CsrfContextImp}>
            <AuthContext.Provider value={AuthContextImp}>
                <BrowserRouter>
                    <Routes>
                        {AppRoutes(AuthContextImp.auth).map(route =>
                            <Route path={route.path} element={route.component} key={route.path}></Route>)
                        }
                    </Routes>
                </BrowserRouter>
            </AuthContext.Provider>
        </CsrfContext.Provider>
    );
};

export default App;

