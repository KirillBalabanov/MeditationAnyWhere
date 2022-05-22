import StartPage from "./pages/StartPage";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import VerificationPage from "./pages/VerificationPage";
import ErrorPage from "./pages/ErrorPage";
import MainPage from "./pages/MainPage";
import React from "react";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import {Navigate} from "react-router-dom";
import ChangeEmailPage from "./pages/ChangeEmailPage";

export interface RouteI {
    path: string,
    component: JSX.Element
}

export const appRoutes: RouteI[] = [
    {path: "/start", component: <StartPage></StartPage>},
    {path: "/registration", component: <RegistrationPage></RegistrationPage>},
    {path: "/login", component: <LoginPage></LoginPage>},
    {path: "/verification/:activationCode", component: <VerificationPage></VerificationPage>},
    {path: "/change/email/:code", component: <ChangeEmailPage></ChangeEmailPage>},
    {path: "/profile/:username", component: <ProfilePage></ProfilePage>},
    {path: "/", component: <MainPage></MainPage>},

    // private routes
    {path: "/settings/:setting", component: <SettingsPage/>},
    {path: "/settings", component: <Navigate to={"/settings/profile"}/>},

    // 404 handler
    {path: "/*", component: <ErrorPage></ErrorPage>}
]