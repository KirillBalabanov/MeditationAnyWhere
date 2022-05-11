import React, {FC, FormEvent, useCallback, useContext, useState} from 'react';
import classes from "../styles/AuthPage.module.css";
import {Link} from "react-router-dom";
import {CsrfContext, CsrfContextI} from "../../context/CsrfContext";
import {AuthContext, AuthContextI} from "../../context/AuthContext";
import {useAuthRedirect} from "../../hooks/useAuthRedirect";
import Form, {FormStyles} from "../../components/form/Form";
import FormTitle from "../../components/form/FormTitle";
import FormInput from "../../components/form/FormInput";
import {ErrorI, UserI} from "../../types/types";
import {validFormInput, ValidFormValidator} from "../../components/form/FormService/validFormInput";
import {animateFetchRequest} from "../../components/form/FormService/animateFetchRequest";
import {isValidEmail} from "../../util/UserValidator/isValidEmail";
import {isValidUsername} from "../../util/UserValidator/isValidUsername";
import {isValidPassword} from "../../util/UserValidator/isValidPassword";


const RegistrationPage: FC = () => {
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
            isValidUsername(username);
            isValidEmail(email)
            isValidPassword(password);
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
            animateFetchRequest(setIsLoading, setFormClasses, failed);
        });
    }, [csrfContext?.csrfToken]);


    return (
        <div>
            <div className={classes.auth__outer}>
                <Form formStyle={formClasses} submitCallback={postRegister} isLoadingRequest={isLoading}
                      errorMsg={errorMsg} buttonTitle={"Register"}>

                    <FormTitle title={"Create account"}></FormTitle>
                    <FormInput placeholder={"Input username"} type={"text"} name={"username"}
                               onInput={(e) => validFormInput(e, ValidFormValidator.username, setErrorMsg)}
                    />
                    <FormInput placeholder={"Input email"} type={"email"} name={"email"}
                               onInput={(e) => validFormInput(e, ValidFormValidator.email, setErrorMsg)}
                    />
                    <FormInput placeholder={"Input password"} type={"password"} name={"password"}
                               onInput={(e) => validFormInput(e, ValidFormValidator.password, setErrorMsg)}
                    />
                </Form>
                <Link to={"/login"} className={classes.auth__link}>log in</Link>
            </div>
        </div>
    );
};

export default RegistrationPage;