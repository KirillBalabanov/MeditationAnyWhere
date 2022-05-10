import React, {FormEvent, useCallback, useContext, useState} from 'react';
import classes from "../styles/AuthPage.module.css";
import {Link} from "react-router-dom";
import {CsrfContext, CsrfContextI} from "../context/CsrfContext";
import {AuthContext, AuthContextI} from "../context/AuthContext";
import {useAuthRedirect} from "../hooks/useAuthRedirect";
import Form, {FormStyles} from "../components/form/Form";
import FormTitle from "../components/form/FormTitle";
import FormInput from "../components/form/FormInput";
import UserValidator from "../util/UserValidator";
import {ErrorI, UserI} from "../types/types";
import FormService, {ValidFormValidator} from "../components/form/FormService";


const RegistrationPage = () => {
    const csrfContext = useContext<CsrfContextI | null>(CsrfContext);
    const authContext = useContext<AuthContextI | null>(AuthContext);

    const [isLoading, setIsLoading] = useState(false);
    const [formClasses, setFormClasses] = useState<FormStyles[]>([]);

    const [errorMsg, setErrorMsg] = useState("");

    // redirect in case user is logged in and trying to reach this page
    useAuthRedirect(authContext!);

    const postRegister = useCallback((e: FormEvent) => {
        e.preventDefault();
        let children = (e.target as Element).children;

        let username = (children[1] as HTMLInputElement).value;
        let email = (children[2] as HTMLInputElement).value;
        let password = (children[3] as HTMLInputElement).value;
        try {
            UserValidator.isValidUsername(username);
            UserValidator.isValidEmail(email)
            UserValidator.isValidPassword(password);
            setErrorMsg("");
        } catch (e) {
            if(e instanceof Error){
                setErrorMsg(e.message);
            }
            return;
        }
        setFormClasses([FormStyles.loading]);
        setIsLoading(true);
        fetch("/user/auth/registration", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': csrfContext?.csrfToken!
            },
            body: JSON.stringify({
                "username": username,
                "email": email,
                "password": password
            })
        }).then((response) => response.json()).then((data: UserI | ErrorI) => {
            let failed: boolean = false;
            if("errorMsg" in data) {
                setErrorMsg(data["errorMsg"]);
                failed = true;
            }
            else {
                setErrorMsg("Verification email has been sent.");
                // clear inputs
                (children[1] as HTMLInputElement).value = "";
                (children[2] as HTMLInputElement).value = "";
                (children[3] as HTMLInputElement).value = "";
            }
            FormService.animateFetchRequest(setIsLoading, setFormClasses, failed);
        });
    }, []);


    return (
        <div>
            <div className={classes.auth__outer}>
                <Form formStyle={formClasses} submitCallback={postRegister} isLoadingRequest={isLoading}
                      errorMsg={errorMsg} buttonTitle={"Register"}>

                    <FormTitle title={"Create account"}></FormTitle>
                    <FormInput setErrorMsg={setErrorMsg} placeholder={"Input username"} type={"text"} name={"username"}
                               onInput={(e) => FormService.validFormInput(e, ValidFormValidator.username, setErrorMsg)}
                    />
                    <FormInput setErrorMsg={setErrorMsg} placeholder={"Input email"} type={"email"} name={"email"}
                               onInput={(e) => FormService.validFormInput(e, ValidFormValidator.email, setErrorMsg)}
                    />
                    <FormInput setErrorMsg={setErrorMsg} placeholder={"Input password"} type={"password"} name={"password"}
                               onInput={(e) => FormService.validFormInput(e, ValidFormValidator.password, setErrorMsg)}
                    />
                </Form>
                <Link to={"/login"} className={classes.auth__link}>log in</Link>
            </div>
        </div>
    );
};

export default RegistrationPage;