import React, {FC, FormEvent, useState} from 'react';
import classes from "../styles/AuthPage.module.css";
import {Link} from "react-router-dom";
import {useAuthRedirect} from "../../hooks/useAuthRedirect";
import Form, {FormState} from "../../components/form/Form";
import FormTitle from "../../components/form/FormTitle";
import FormInput from "../../components/form/FormInput";
import {validFormInput, ValidFormValidator} from "../../components/form/FormService/validFormInput";
import {animateFetchRequest} from "../../components/form/FormService/animateFetchRequest";
import {isValidUsername} from "../../util/UserValidator/isValidUsername";
import {isValidPassword} from "../../util/UserValidator/isValidPassword";
import {useCacheStore} from "../../context/CacheStore/CacheStoreContext";
import {ErrorFetchI, UserFetchI} from "../../types/serverTypes";
import {loginUser} from "../../context/CacheStore/CacheStoreService/loginUser";
import {csrfFetching, FetchContentTypes, FetchingMethods} from "../../util/Fetch/csrfFetching";
import FormInputContainer from "../../components/form/FormInputContainer";

const LoginPage: FC = () => {
    const cacheStore = useCacheStore()!;
    const [authState] = cacheStore.authReducer;

    useAuthRedirect(authState.auth);

    const [formState, setFormState] = useState<FormState>(FormState.DEFAULT);

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const postLogin = (e: FormEvent) => {
        e.preventDefault();

        let username = (e.currentTarget.querySelector("input[name=username]") as HTMLInputElement).value;
        let password = (e.currentTarget.querySelector("input[name=password]") as HTMLInputElement).value;
        try {
            isValidUsername(username);
            isValidPassword(password);
            setErrorMsg(null);
        } catch (e) {
            if (e instanceof Error) {
                setErrorMsg(e.message);
            }
            return;
        }
        setFormState(FormState.LOADING);

        let body = JSON.stringify({
            "username": username,
            "password": password
        });
        csrfFetching("/user/auth/login", FetchingMethods.POST, FetchContentTypes.APPLICATION_JSON, body).then((response) => {
            if(!response.ok) return {errorMsg: "Error"}
            return response.json()
        }).then((data: UserFetchI | ErrorFetchI) => {
            let failed: boolean = false;
            if ("errorMsg" in data) {
                setErrorMsg(data["errorMsg"]);
                failed = true;
            } else {
                setTimeout(() => {
                    loginUser(data, cacheStore);
                }, 1000); // for animation

            }
            // animation
            animateFetchRequest(setFormState, failed)
        });
    };

    return (
        <div className={classes.auth}>
            <div className={classes.auth__outer}>
                <Form formState={formState} submitCallback={postLogin}
                      errorMsg={errorMsg} buttonTitle={"Log in"}>

                    <FormTitle title={"Create account"}></FormTitle>
                    <FormInputContainer>
                        <FormInput placeholder={"Input username"} type={"text"} name={"username"}
                                   onInput={(e) => validFormInput(e, ValidFormValidator.username, setErrorMsg)}
                        />
                        <FormInput placeholder={"Input password"} type={"password"} name={"password"}
                                   onInput={(e) => validFormInput(e, ValidFormValidator.password, setErrorMsg)}
                        />
                    </FormInputContainer>

                </Form>
                <Link to={"/registration"} className={classes.auth__link}>register</Link>
            </div>
        </div>
    );
};

export default LoginPage;