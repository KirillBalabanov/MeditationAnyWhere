import StartPage from "../pages/StartPage";
import RegistrationPage from "../pages/RegistrationPage";
import LoginPage from "../pages/LoginPage";
import VerificationPage from "../pages/VerificationPage";
import Error404 from "../pages/Error404";
import MainPage from "../pages/MainPage";
import React from "react";
import {Navigate} from "react-router-dom";

const publicRoutes = [
    {path: "/start", component: <StartPage></StartPage>},
    {path: "/registration", component: <RegistrationPage></RegistrationPage>},
    {path: "/login", component: <LoginPage></LoginPage>},
    {path: "/verification/:activationCode", component: <VerificationPage></VerificationPage>},
    {path: "/*", component: <Error404></Error404>},
]

const privateRoutes = (auth: boolean) => [
    {path: "/", component: auth ? <MainPage></MainPage> : <Navigate to={"/login"}/>},
]

export const AppRoutes = (auth: boolean) =>  [
    ...publicRoutes,
    ...privateRoutes(auth)
]