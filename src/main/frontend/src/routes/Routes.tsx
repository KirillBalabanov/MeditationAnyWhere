import StartPage from "../pages/StartPage";
import RegistrationPage from "../pages/RegistrationPage";
import LoginPage from "../pages/LoginPage";
import VerificationPage from "../pages/VerificationPage";
import Error from "../pages/Error";
import MainPage from "../pages/MainPage";
import React from "react";
import {Navigate} from "react-router-dom";
import ProfilePage from "../pages/ProfilePage";

const publicRoutes = [
    {path: "/start", component: <StartPage></StartPage>},
    {path: "/registration", component: <RegistrationPage></RegistrationPage>},
    {path: "/login", component: <LoginPage></LoginPage>},
    {path: "/verification/:activationCode", component: <VerificationPage></VerificationPage>},
    {path: "/profile/:username", component: <ProfilePage></ProfilePage>},
    {path: "/*", component: <Error></Error>}
]

const privateRoutes = (auth: boolean) => [
    {path: "/", component: auth ? <MainPage></MainPage> : <Navigate to={"/login"}/>},
]

export const AppRoutes = (auth: boolean) =>  [
    ...publicRoutes,
    ...privateRoutes(auth)
]