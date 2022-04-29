import React, {FC} from 'react';
import './styles/App.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {AuthContext} from "./context/AuthContext";
import {CsrfContext} from "./context/CsrfContext";
import {useToken} from "./hooks/useToken";
import {useAuth} from "./hooks/useAuth";
import {privateRoutes, publicRoutes} from "./routes/Routes";


const App:FC = () => {

    // getting auth info, setting it to global context
    const CsrfContextImp = useToken();
    const AuthContextImp = useAuth();
    const auth = AuthContextImp.auth;

    return (
        <CsrfContext.Provider value={CsrfContextImp}>
            <AuthContext.Provider value={AuthContextImp}>
                <BrowserRouter>
                    <Routes>
                        {privateRoutes.map(route =>
                            <Route path={route.path} element={auth ? route.component() : <Navigate to={"/login"}/>}></Route>
                        )}
                        {publicRoutes.map(route =>
                            <Route path={route.path} element={route.component()}></Route>
                        )}
                    </Routes>
                </BrowserRouter>
            </AuthContext.Provider>
        </CsrfContext.Provider>
    );
};

export default App;

