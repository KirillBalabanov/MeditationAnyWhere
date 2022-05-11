import React, {FC, FormEvent, useCallback, useContext, useState} from 'react';
import classes from "../styles/AuthPage.module.css";
import {Link} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import {CsrfContext} from "../../context/CsrfContext";
import {useAuthRedirect} from "../../hooks/useAuthRedirect";
import Form, {FormStyles} from "../../components/form/Form";
import FormTitle from "../../components/form/FormTitle";
import FormInput from "../../components/form/FormInput";
import {ErrorI, LoginI} from "../../types/types";
import {HeaderContext} from "../../context/HeaderContext";
import {validFormInput, ValidFormValidator} from "../../components/form/FormService/validFormInput";
import {animateFetchRequest} from "../../components/form/FormService/animateFetchRequest";
import {isValidUsername} from "../../util/UserValidator/isValidUsername";
import {isValidPassword} from "../../util/UserValidator/isValidPassword";

const LoginPage: FC = () => {
    const csrfContext = useContext(CsrfContext)!;
    let authContext = useContext(AuthContext)!;

    // animation states
    const [isLoading, setIsLoading] = useState(false);
    const [formClasses, setFormClasses] = useState<FormStyles[]>([]);

    const [errorMsg, setErrorMsg] = useState("");

    const headerContext = useContext(HeaderContext);
    useAuthRedirect(authContext);

    const postLogin = useCallback((e: FormEvent) => {
        e.preventDefault();
        let children = (e.target as Element).children;
        let username = (children[1] as HTMLInputElement).value;
        let password = (children[2] as HTMLInputElement).value;
        let errorText = children[3] as HTMLParagraphElement;
        try {
            isValidUsername(username);
            isValidPassword(password);
            errorText.textContent = "";
        } catch (e) {
            if (e instanceof Error) {
                errorText.textContent = e.message;
            }
            return;
        }
        setFormClasses([FormStyles.loading]);
        setIsLoading(true);
        fetch("/user/auth/login", {
            method: "POST", headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': csrfContext.csrfToken
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        }).then((response) => response.json()).then((data: LoginI | ErrorI) => {
            let failed: boolean = false;
            if ("errorMsg" in data) {
                errorText.textContent = data["errorMsg"];
                failed = true;
            } else {
                setTimeout(() => {
                    authContext.setAuth(data["authenticated"]);
                    authContext.setUsername(data["username"]);
                    csrfContext.setToken(data["csrf"]);
                    headerContext?.setReload(true);
                }, 200); // for animation

            }
            // animation
            animateFetchRequest(setIsLoading, setFormClasses, failed)
        });
    }, [authContext, csrfContext, headerContext]);

    return (
        <div>
            <div className={classes.auth__outer}>
                <Form formStyle={formClasses} submitCallback={postLogin} isLoadingRequest={isLoading}
                      errorMsg={errorMsg} buttonTitle={"Log in"}>

                    <FormTitle title={"Create account"}></FormTitle>
                    <FormInput placeholder={"Input username"} type={"text"} name={"username"}
                               onInput={(e) => validFormInput(e, ValidFormValidator.username, setErrorMsg)}
                    />
                    <FormInput placeholder={"Input password"} type={"password"} name={"password"}
                               onInput={(e) => validFormInput(e, ValidFormValidator.password, setErrorMsg)}
                    />
                </Form>
                <Link to={"/registration"} className={classes.auth__link}>register</Link>
            </div>
        </div>
    );
};

export default LoginPage;