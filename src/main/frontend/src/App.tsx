import React, {FC, useState} from 'react';
import './styles/App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AuthContext, AuthContextI} from "./context/AuthContext";
import {CsrfContext, CsrfContextI} from "./context/CsrfContext";
import {appRoutes} from "./routes/Routes";
import {useAuth} from "./hooks/useAuth";
import {useToken} from "./hooks/useToken";
import Loader from "./components/loader/Loader";
import Header from "./components/header/Header";
import {HeaderContext, HeaderContextI} from "./context/HeaderContext";


const App: FC = () => {

    const [isLoading, setIsLoading] = useState(true);

    const [auth, setAuth] = useState(false);
    const [username, setUsername] = useState("$anonymous");
    let AuthContextImp: AuthContextI = {
        auth: auth,
        setAuth: setAuth,
        username: username,
        setUsername: setUsername
    }
    const [token, setToken] = useState("$token");
    const CsrfContextImp: CsrfContextI = {
        csrfToken: token,
        setToken: setToken
    }
    const [showHeader, setShowHeader] = useState(true);
    const [reloadHeader, setReloadHeader] = useState(false);
    const HeaderContextImp: HeaderContextI = {
        reload: reloadHeader,
        setReload: setReloadHeader,
        showHeader: showHeader,
        setShowHeader: setShowHeader
    }

    useToken(CsrfContextImp);
    useAuth(AuthContextImp, setIsLoading);

    if (isLoading) return (<Loader></Loader>)

    return (
        <CsrfContext.Provider value={CsrfContextImp}>
            <AuthContext.Provider value={AuthContextImp}>
                <HeaderContext.Provider value={HeaderContextImp}>
                    <BrowserRouter>
                        <Header></Header>
                        <Routes>
                            {appRoutes(AuthContextImp.auth).map(route =>
                                <Route path={route.path} element={route.component} key={route.path}></Route>)
                            }
                        </Routes>
                    </BrowserRouter>
                </HeaderContext.Provider>
            </AuthContext.Provider>
        </CsrfContext.Provider>
    );
};

export default App;

