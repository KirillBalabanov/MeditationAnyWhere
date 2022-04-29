import React, {FC} from 'react';
import './styles/App.css';
import {HashRouter, Route} from "react-router-dom";
import {AuthContext} from "./context/AuthContext";
import {CsrfContext} from "./context/CsrfContext";
import {useToken} from "./hooks/useToken";
import {useAuth} from "./hooks/useAuth";
import StartPage from "./pages/StartPage";


const App:FC = () => {

    // getting auth info, setting it to global context
    const CsrfContextImp = useToken();
    const AuthContextImp = useAuth();


    return (
        <CsrfContext.Provider value={CsrfContextImp}>
            <AuthContext.Provider value={AuthContextImp}>
                <HashRouter>
                    <Route path={"/"}><StartPage></StartPage></Route>
                </HashRouter>
            </AuthContext.Provider>
        </CsrfContext.Provider>
    );
};

export default App;

