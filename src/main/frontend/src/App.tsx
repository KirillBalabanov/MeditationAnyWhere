import React, {FC, useEffect, useState} from 'react';
import './styles/App.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {AuthContext} from "./context/AuthContext";
import {CsrfContext} from "./context/CsrfContext";
import {useToken} from "./hooks/useToken";
import {useAuth} from "./hooks/useAuth";
import {privateRoutes, publicRoutes} from "./routes/Routes";


const App:FC = () => {

    // getting auth info, setting it to global context
    const [loading, setLoading] = useState(true);

    let CsrfContextImp = useToken();
    let AuthContextImp = useAuth(setLoading);

    if(loading) return (<div>Loading</div>);

    console.log(AuthContextImp.username);

    return (
        <CsrfContext.Provider value={CsrfContextImp}>
            <AuthContext.Provider value={AuthContextImp}>
                <BrowserRouter>
                    <Routes>
                        {privateRoutes.map(route =>
                            <Route key={Date.now()} path={route.path} element={AuthContextImp.auth ? route.component() : <Navigate to={"/login"}/>}></Route>
                        )}
                        {publicRoutes.map(route =>
                            <Route key={Date.now()} path={route.path} element={route.component()}></Route>
                        )}
                    </Routes>
                </BrowserRouter>
            </AuthContext.Provider>
        </CsrfContext.Provider>
    );
};

export default App;

