import React, {FC} from 'react';
import './routes/styles/App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./components/header/Header";
import {appRoutes} from "./routes/Routes";
import {CacheStoreProvider} from "./context/CacheStore/CacheStoreContext";


const App: FC = () => {

    return (
        <CacheStoreProvider>
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
        </CacheStoreProvider>
    );
};

export default App;

