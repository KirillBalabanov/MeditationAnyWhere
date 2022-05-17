import React, {FC, FormEvent, useCallback, useState} from 'react';
import classes from "../styles/AuthPage.module.css";
import {Link} from "react-router-dom";
import {useAuthRedirect} from "../../hooks/useAuthRedirect";
import Form, {FormStyles} from "../../components/form/Form";
import FormTitle from "../../components/form/FormTitle";
import FormInput from "../../components/form/FormInput";
import {validFormInput, ValidFormValidator} from "../../components/form/FormService/validFormInput";
import {animateFetchRequest} from "../../components/form/FormService/animateFetchRequest";
import {isValidUsername} from "../../util/UserValidator/isValidUsername";
import {isValidPassword} from "../../util/UserValidator/isValidPassword";
import {useCacheStore} from "../../context/CacheStore/CacheStoreContext";
import {ErrorFetchI, LoginFetchI} from "../../types/serverTypes";
import {loginUser} from "../../context/CacheStore/CacheStoreService/loginUser";

const LoginPage: FC = () => {
    const cacheStore = useCacheStore()!;
    const [authState] = cacheStore.authReducer;
    const [csrfState] = cacheStore.csrfReducer;

    useAuthRedirect(authState.auth);

    const [isLoading, setIsLoading] = useState(false);
    const [formClasses, setFormClasses] = useState<FormStyles[]>([]);

    const [errorMsg, setErrorMsg] = useState("");

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
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': csrfState.csrfToken!
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        }).then((response) => response.json()).then((data: LoginFetchI | ErrorFetchI) => {
            let failed: boolean = false;
            if ("errorMsg" in data) {
                errorText.textContent = data["errorMsg"];
                failed = true;
            } else {
                setTimeout(() => {
                    loginUser(data.username, data.csrf, cacheStore);
                }, 200); // for animation

            }
            // animation
            animateFetchRequest(setIsLoading, setFormClasses, failed)
        });
    }, [loginUser]);

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