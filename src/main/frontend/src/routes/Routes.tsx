import StartPage from "./pages/StartPage";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import VerificationPage from "./pages/VerificationPage";
import Error from "./pages/Error";
import MainPage from "./pages/MainPage";
import React from "react";
import ProfilePage from "./pages/ProfilePage";
import Settings from "./pages/Settings";
import {Navigate} from "react-router-dom";

export interface RouteI {
    path: string,
    component: JSX.Element
}

export const appRoutes: RouteI[] = [
    {path: "/start", component: <StartPage></StartPage>},
    {path: "/registration", component: <RegistrationPage></RegistrationPage>},
    {path: "/login", component: <LoginPage></LoginPage>},
    {path: "/verification/:activationCode", component: <VerificationPage></VerificationPage>},
    {path: "/profile/:username", component: <ProfilePage></ProfilePage>},
    {path: "/", component: <MainPage></MainPage>},

    // private routes
    {path: "/settings/:setting", component: <Settings/>},
    {path: "/settings", component: <Navigate to={"/settings/profile"}/>},

    // 404 handler
    {path: "/*", component: <Error></Error>}
]