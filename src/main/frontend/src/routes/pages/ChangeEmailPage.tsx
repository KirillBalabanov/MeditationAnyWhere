import React, {FormEvent, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import Form, {FormState} from "../../components/form/Form";
import FormTitle from "../../components/form/FormTitle";
import FormInputContainer from "../../components/form/FormInputContainer";
import FormInput from "../../components/form/FormInput";
import {validFormInput, ValidFormValidator} from "../../components/form/FormService/validFormInput";
import classes from "../styles/ChangeEmailPage.module.css";
import {CodePasswordModel} from "../../types/frontendTypes";
import {EmailFetchI, ErrorFetchI, UserFetchI} from "../../types/serverTypes";
import Loader from "../../components/loader/Loader";
import {isValidPassword} from "../../util/UserValidator/isValidPassword";
import {csrfFetching, FetchContentTypes, FetchingMethods} from "../../util/Fetch/csrfFetching";
import {animateFetchRequest} from "../../components/form/FormService/animateFetchRequest";
import ErrorPage from "./ErrorPage";
import {useStore} from "../../context/CacheStore/StoreContext";
import {UserActionTypes} from "../../reducer/userReducer";

const ChangeEmailPage = () => {
    let code: string = useParams()["code"]!;

    const cacheStore = useStore()!;
    const [, userDispatcher] = cacheStore.userReducer;

    const [formState, setFormState] = useState(FormState.DEFAULT);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [isCodeInvalid, setIsCodeInvalid] = useState(false);
    const [newEmail, setNewEmail] = useState<null | string>(null);
    const [isLoading, setIsLoading] = useState(true);

    let navigateFunction = useNavigate();

    const submitCallback = (e: FormEvent) => {
        e.preventDefault();
        let password = (e.currentTarget.querySelector("input[type=password]") as HTMLInputElement).value;
        try {
            isValidPassword(password);
        } catch (e) {
            if (e instanceof Error) {
                setErrorMsg(e.message);
            }
            return;
        }

        let codePasswordModel: CodePasswordModel = {
            code: code,
            password: password,
        }
        setFormState(FormState.LOADING);
        csrfFetching("/api/users/current/change/email/verify", FetchingMethods.PUT, FetchContentTypes.APPLICATION_JSON, JSON.stringify(codePasswordModel))
            .then((response) => response.json()).then((data: UserFetchI | ErrorFetchI) => {
            let failed = true;
            if ("errorMsg" in data) {
                setErrorMsg(data.errorMsg);
            } else {
                failed = false;
                setErrorMsg("Email successfully changed.");
                userDispatcher({type: UserActionTypes.SET_EMAIL, payload: data.email})
                setTimeout(() => {
                    navigateFunction("/");
                }, 1500);
            }
            animateFetchRequest(setFormState, failed);
        });

    };

    useEffect(() => {
        fetch("/api/users/current/change/email/code?=code" + code).then((response) => response.json()).then((data: EmailFetchI | ErrorFetchI) => {
            if ("errorMsg" in data) {
                setIsCodeInvalid(true);
            } else {
                setNewEmail(data.email);
            }

            setIsLoading(false);
        });
    }, [code]); // check if code exists

    if(isLoading) return (<Loader/>);

    if (isCodeInvalid) {
        return (<ErrorPage errorMsg={"Code doesn't exist("}></ErrorPage>)
    }

    return (
        <div className={classes.page}>
            <div className={classes.formText}>
                {newEmail !== null&&
                    `To change email to ${newEmail} please authenticate`
                }
            </div>
            <div className={classes.formOuter}>

                <Form formState={formState} submitCallback={submitCallback}
                      errorMsg={errorMsg} buttonTitle={"Confirm"}>

                    <FormTitle title={"Change email - verification"}></FormTitle>



                    <FormInputContainer>
                        <FormInput placeholder={"Input password"} type={"password"} name={"password"}
                                   onInput={(e) => validFormInput(e, ValidFormValidator.password, setErrorMsg)}
                        />
                    </FormInputContainer>

                </Form>
            </div>
        </div>

    );
};

export default ChangeEmailPage;