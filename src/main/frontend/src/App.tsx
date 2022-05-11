import React, {FC, useContext} from 'react';
import './routes/styles/App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AuthContext} from "./context/AuthContext";
import {appRoutes} from "./routes/Routes";
import Header from "./components/header/Header";
import AuthWrapper from "./wrappers/AuthWrapper";
import CsrfWrapper from "./wrappers/CsrfWrapper";
import HeaderWrapper from "./wrappers/HeaderWrapper";


const App: FC = () => {

    return (
        <AuthWrapper>
          <CsrfWrapper>
              <HeaderWrapper>
                  <BrowserRouter>
                      <Header></Header>
                      <Routes>
                          {appRoutes(useContext(AuthContext)?.auth!).map(route =>
                              <Route path={route.path} element={route.component} key={route.path}></Route>)
                          }
                      </Routes>
                  </BrowserRouter>
              </HeaderWrapper>
          </CsrfWrapper>
        </AuthWrapper>
    );
};

export default App;

