import React, {FC} from 'react';
import './routes/styles/App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./components/header/Header";
import {appRoutes} from "./routes/Routes";
import {AuthContextProvider} from "./context/AuthContext";
import {CsrfContextProvider} from "./context/CsrfContext";
import {HeaderContextProvider} from "./context/HeaderContext";


const App: FC = () => {

    return (
        <AuthContextProvider>
            <CsrfContextProvider>
                <HeaderContextProvider>
                    <BrowserRouter>
                        <Header/>
                        <Routes>
                            {appRoutes.map((route) => {
                                return (
                                    <Route path={route.path} element={route.component} key={route.path}/>
                                )
                            })}
                        </Routes>
                    </BrowserRouter>
                </HeaderContextProvider>
            </CsrfContextProvider>
        </AuthContextProvider>
    );
};

export default App;

