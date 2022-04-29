import StartPage from "../pages/StartPage";
import RegistrationPage from "../pages/RegistrationPage";
import LoginPage from "../pages/LoginPage";
import VerificationPage from "../pages/VerificationPage";
import Error404 from "../pages/Error404";
import MainPage from "../pages/MainPage";

export const publicRoutes = [
    {path: "/start", component: StartPage},
    {path: "/registration", component: RegistrationPage},
    {path: "/login", component: LoginPage},
    {path: "/verification/:activationCode", component: VerificationPage},
    {path: "/*", component: Error404},
]

export const privateRoutes = [
    {path: "/", component: MainPage}
]