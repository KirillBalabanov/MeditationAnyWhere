import React, {FC, FormEvent, useCallback, useState} from 'react';
import classes from "../styles/AuthPage.module.css";
import {Link} from "react-router-dom";
import {useAuthRedirect} from "../../hooks/useAuthRedirect";
import Form, {FormState} from "../../components/form/Form";
import FormTitle from "../../components/form/FormTitle";
import FormInput from "../../components/form/FormInput";
import {validFormInput, ValidFormValidator} from "../../components/form/FormService/validFormInput";
import {animateFetchRequest} from "../../components/form/FormService/animateFetchRequest";
import {isValidEmail} from "../../util/UserValidator/isValidEmail";
import {isValidUsername} from "../../util/UserValidator/isValidUsername";
import {isValidPassword} from "../../util/UserValidator/isValidPassword";
import {useCacheStore} from "../../context/CacheStore/CacheStoreContext";
import {ErrorFetchI, UserFetchI} from "../../types/serverTypes";
import {csrfFetching, FetchContentTypes, FetchingMethods} from "../../util/Fetch/csrfFetching";
import FormInputContainer from "../../components/form/FormInputContainer";


const RegistrationPage: FC = () => {
    const cacheStore = useCacheStore()!;
    const [authState] = cacheStore.authReducer;

    useAuthRedirect(authState.auth);

    const [formState, setFormState] = useState<FormState>(FormState.DEFAULT);

    const [errorMsg, setErrorMsg] = useState<string | null>(null);


    const postRegister = useCallback((e: FormEvent) => {
        e.preventDefault();

        let usernameInput = (e.currentTarget.querySelector("input[name=username]") as HTMLInputElement);
        let emailInput = (e.currentTarget.querySelector("input[name=email]") as HTMLInputElement);
        let passwordInput = (e.currentTarget.querySelector("input[name=password]") as HTMLInputElement);

        let username = usernameInput.value;
        let email = emailInput.value;
        let password = passwordInput.value;
        try {
            isValidUsername(username);
            isValidEmail(email)
            isValidPassword(password);
            setErrorMsg(null);
        } catch (e) {
            if(e instanceof Error){
                setErrorMsg(e.message);
            }
            return;
        }
        setFormState(FormState.LOADING);

        let body = JSON.stringify({
            "username": username,
            "email": email,
            "password": password
        })

        csrfFetching("/user/auth/registration", FetchingMethods.POST, FetchContentTypes.APPLICATION_JSON, body).then((response) => {
            return response.json()
        }).then((data: UserFetchI | ErrorFetchI) => {
            let failed: boolean = false;
            if("errorMsg" in data) {
                setErrorMsg(data["errorMsg"]);
                failed = true;
            }
            else {
                setErrorMsg("Verification email has been sent.");
                // clear inputs
                usernameInput.value = "";
                emailInput.value = "";
                passwordInput.value  = "";
            }
            animateFetchRequest(setFormState, failed);
        });
    }, []);


    return (
        <div className={classes.auth}>
            <div className={classes.auth__outer}>
                <Form formState={formState} submitCallback={postRegister}
                      errorMsg={errorMsg} buttonTitle={"Register"}>

                    <FormTitle title={"Create account"}></FormTitle>
                    <FormInputContainer>
                        <FormInput placeholder={"Input username"} type={"text"} name={"username"}
                                   onInput={(e) => validFormInput(e, ValidFormValidator.username, setErrorMsg)}
                        />
                        <FormInput placeholder={"Input email"} type={"email"} name={"email"}
                                   onInput={(e) => validFormInput(e, ValidFormValidator.email, setErrorMsg)}
                        />
                        <FormInput placeholder={"Input password"} type={"password"} name={"password"}
                                   onInput={(e) => validFormInput(e, ValidFormValidator.password, setErrorMsg)}
                        />
                    </FormInputContainer>

                </Form>
                <Link to={"/login"} className={classes.auth__link}>log in</Link>
            </div>
        </div>
    );
};

export default RegistrationPage;