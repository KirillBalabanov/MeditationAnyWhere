import React, {FC} from 'react';
import './styles/App.css';
import {HashRouter, Route, Routes} from "react-router-dom";
import StartPage from "./pages/StartPage";
import MainPage from "./pages/MainPage";
import Error404 from "./pages/Error404";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import {AuthContext} from "./context/AuthContext";
import {CsrfContext} from "./context/CsrfContext";
import {useToken} from "./hooks/useToken";
import {useAuth} from "./hooks/useAuth";


const App:FC = () => {

    // getting auth info, setting it to global context
    const CsrfContextImp = useToken();
    const AuthContextImp = useAuth();


    return (
        <CsrfContext.Provider value={CsrfContextImp}>
            <AuthContext.Provider value={AuthContextImp}>
                <HashRouter>
                    <Routes>
                        <Route path={"/"} element={<StartPage></StartPage>}></Route>
                        <Route path={"/main"} element={<MainPage></MainPage>}></Route>
                        <Route path={"/login"} element={<LoginPage></LoginPage>}></Route>
                        <Route path={"/registration"} element={<RegistrationPage></RegistrationPage>}></Route>
                        <Route path={"*"} element={<Error404></Error404>}></Route>
                    </Routes>
                </HashRouter>
            </AuthContext.Provider>
        </CsrfContext.Provider>
    );
};

export default App;

