import React, {FormEvent, useContext, useEffect, useState} from 'react';
import classes from "../styles/AuthPage.module.css";
import {Link, useNavigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import {CsrfContext} from "../context/CsrfContext";
import {useAuthRedirect} from "../hooks/useAuthRedirect";
import UserValidator from "../util/UserValidator";
import Form, {FormStyles} from "../components/form/Form";
import FormTitle from "../components/form/FormTitle";
import FormInput from "../components/form/FormInput";
import FormService, {ValidFormValidator} from "../components/form/FormService";
import {ErrorI, LoginI} from "../types/types";

const LoginPage = () => {
    const csrfContext = useContext(CsrfContext)!;
    let authContext = useContext(AuthContext)!;

    // animation states
    const [isLoading, setIsLoading] = useState(false);
    const [formClasses, setFormClasses] = useState<FormStyles[]>([]);
    const [redirect, setRedirect] = useState(false);

    const [errorMsg, setErrorMsg] = useState("");

    useAuthRedirect(authContext.auth);

    // navigate on successful log in
    let navigateFunction = useNavigate();
    useEffect(() => {
        if(redirect) {
            setTimeout(() => {
                navigateFunction("/");
            }, 1200);
        }
    }, [redirect]);

    function postLogin(e: FormEvent) {
        e.preventDefault();
        let children = (e.target as Element).children;
        let username = (children[1] as HTMLInputElement).value;
        let password = (children[2] as HTMLInputElement).value;
        let errorText = children[3] as HTMLParagraphElement;
        try {
            UserValidator.isValidUsername(username);
            UserValidator.isValidPassword(password);
            errorText.textContent = "";
        } catch (e) {
            if(e instanceof Error){
                errorText.textContent = e.message;
            }
            return;
        }
        setFormClasses([FormStyles.loading]);
        setIsLoading(true);
        fetch("/user/auth/login", { method: "POST", headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': csrfContext.csrfToken
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        }).then((response) => response.json()).then((data: LoginI | ErrorI) => {
            let failed: boolean = false;
            if("error" in data) {
                errorText.textContent = data["error"];
                failed = true;
            }
            else {
                authContext.setAuth(data["authenticated"]);
                authContext.setUsername(data["username"]);
                csrfContext.setToken(data["csrf"]);
                setRedirect(true);
            }
            // animation
            FormService.animateFetchRequest(setIsLoading, setFormClasses, failed)
        });
    }

    return (
        <div>
            <div className={classes.auth__outer}>
                <Form formStyle={formClasses} submitCallback={postLogin} isLoadingRequest={isLoading}
                      errorMsg={errorMsg} buttonTitle={"Log in"}>

                    <FormTitle title={"Create account"}></FormTitle>
                    <FormInput setErrorMsg={setErrorMsg} placeholder={"Input username"} type={"text"} name={"username"}
                               onInput={(e) => FormService.validFormInput(e, ValidFormValidator.username, setErrorMsg)}
                    />
                    <FormInput setErrorMsg={setErrorMsg} placeholder={"Input password"} type={"password"} name={"password"}
                               onInput={(e) => FormService.validFormInput(e, ValidFormValidator.password, setErrorMsg)}
                    />
                </Form>
                <Link to={"/registration"} className={classes.auth__link}>register</Link>
            </div>
        </div>
    );
};

export default LoginPage;