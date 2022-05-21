import React, {FC, FormEvent, SetStateAction, useEffect, useState} from 'react';
import classes from "../../../popup/Popup.module.css";
import {usePopup} from "../../../popup/usePopup";
import popupCloseIcon from "../../../../images/closePopupBtn.svg";
import Form, {FormState} from "../../../form/Form";
import FormTitle from "../../../form/FormTitle";
import FormInput from "../../../form/FormInput";
import {validFormInput, ValidFormValidator} from "../../../form/FormService/validFormInput";
import FormInputContainer from "../../../form/FormInputContainer";
import {csrfFetching, FetchContentTypes, FetchingMethods} from "../../../../util/Fetch/csrfFetching";
import {ChangeEmailModel, ChangeUsernameModel, PasswordModel} from "../../../../types/frontendTypes";
import {ErrorFetchI, UserFetchI} from "../../../../types/serverTypes";
import {useCacheStore} from "../../../../context/CacheStore/CacheStoreContext";
import {UserActionTypes} from "../../../../reducer/userReducer";
import {animateFetchRequest} from "../../../form/FormService/animateFetchRequest";
import {isValidPassword} from "../../../../util/UserValidator/isValidPassword";
import {isValidUsername} from "../../../../util/UserValidator/isValidUsername";
import {isValidEmail} from "../../../../util/UserValidator/isValidEmail";
import {useNavigate} from "react-router-dom";
import {AuthActionTypes} from "../../../../reducer/authReducer";

export enum ValidationPopupType {
    CHANGE_USERNAME= "Change Username",
    DELETE_ACCOUNT = "Delete Account",
    CHANGE_EMAIL = "Change Email",
}

interface PopupProps {
    shown: boolean,
    setShown: React.Dispatch<SetStateAction<boolean>>,
    type: ValidationPopupType,
}

const AccountFormPopup: FC<PopupProps> = ({setShown, shown, type}) => {
    usePopup(setShown);

    let navigateFunction = useNavigate();

    const cacheStore = useCacheStore()!;
    const [userState, userDispatcher] = cacheStore.userReducer;
    const [, authDispatcher] = cacheStore.authReducer;

    const [inputContainerKey, setInputContainerKey] = useState(Date.now());
    const [formState, setFormState] = useState<FormState>(FormState.DEFAULT);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

        switch (type) {
            case ValidationPopupType.CHANGE_USERNAME:
                let username = (e.currentTarget.querySelector("input[name=username]") as HTMLInputElement).value;
                try {
                    isValidUsername(username);
                    if(username === userState.username) throw Error("Please change username");
                } catch (e) {
                    if (e instanceof Error) {
                        setErrorMsg(e.message);
                    }
                    return;
                }
                let usernameModel: ChangeUsernameModel = {
                    username: username,
                    password: password,
                }
                setFormState(FormState.LOADING);
                csrfFetching("/user/change/username", FetchingMethods.PUT, FetchContentTypes.APPLICATION_JSON, JSON.stringify(usernameModel))
                    .then((response) => response.json()).then((data: UserFetchI | ErrorFetchI) => {
                        let failed = true;
                        if ("errorMsg" in data) {
                            setErrorMsg(data.errorMsg);
                        } else {
                            failed = false;
                            userDispatcher({type: UserActionTypes.SET_USERNAME, payload: data.username})
                            setErrorMsg("Username successfully changed");
                        }
                    animateFetchRequest(setFormState, failed);
                });
                break;

            case ValidationPopupType.CHANGE_EMAIL:
                let email = (e.currentTarget.querySelector("input[name=email]") as HTMLInputElement).value;
                try {
                    isValidEmail(email);
                    if(email === userState.email) throw Error("Please change email");
                } catch (e) {
                    if (e instanceof Error) {
                        setErrorMsg(e.message);
                    }
                    return;
                }
                let emailModel: ChangeEmailModel = {
                    email: email,
                    password: password,
                }
                setFormState(FormState.LOADING);
                csrfFetching("/user/change/email", FetchingMethods.PUT, FetchContentTypes.APPLICATION_JSON, JSON.stringify(emailModel))
                    .then((response) => response.json()).then((data: UserFetchI | ErrorFetchI) => {
                    let failed = true;
                    if ("errorMsg" in data) {
                        setErrorMsg(data.errorMsg);
                    } else {
                        failed = false;
                        setErrorMsg("Please go to " + email + " and follow the instructions in the list.");
                    }
                    animateFetchRequest(setFormState, failed);
                });
                break;

            case ValidationPopupType.DELETE_ACCOUNT:

                let passwordModel: PasswordModel = {
                    password: password,
                }
                setFormState(FormState.LOADING);
                csrfFetching("/user/delete/account", FetchingMethods.DELETE, FetchContentTypes.APPLICATION_JSON, JSON.stringify(passwordModel))
                    .then((response) => response.json()).then((data: ErrorFetchI | UserFetchI) => {
                    let failed = true;
                    if ("errorMsg" in data) {
                        setErrorMsg(data.errorMsg);
                    } else {
                        failed = false;
                        setErrorMsg("Account deleted.");
                        setTimeout(() => {
                            userDispatcher({type: UserActionTypes.RESET_ALL});
                            authDispatcher({type: AuthActionTypes.LOGOUT})
                            navigateFunction("/start");
                        }, 1500);
                    }
                    animateFetchRequest(setFormState, failed);
                });
                break;


        }
    };

    useEffect(() => {
        if (!shown) {
            setInputContainerKey(Date.now());
            setErrorMsg(null);
        }

    }, [shown]);


    return (
        <div className={shown ? classes.popup + " " + classes.active : classes.popup} onMouseDown={() => setShown(false)}>
            <div className={classes.popup__box + " " + classes.popup__form} onMouseDown={(e) => e.stopPropagation()}>
                <div className={classes.popup__info}>
                    <Form formState={formState} submitCallback={submitCallback}
                          errorMsg={errorMsg} buttonTitle={"Confirm"}>

                        <FormTitle title={type !== null ? type.toString() : ""}></FormTitle>

                        <FormInputContainer key={inputContainerKey}>
                            {
                                type === ValidationPopupType.CHANGE_USERNAME
                                &&
                                <FormInput placeholder={"Input new username"} type={"text"} name={"username"}
                                           onInput={(e) => validFormInput(e, ValidFormValidator.username, setErrorMsg)}/>
                            }
                            {
                                type === ValidationPopupType.CHANGE_EMAIL
                                &&
                                <FormInput placeholder={"Input email"} type={"email"} name={"email"}
                                           onInput={(e) => validFormInput(e, ValidFormValidator.email, setErrorMsg)}
                                />
                            }

                            <FormInput placeholder={"Input password"} type={"password"} name={"password"}
                                       onInput={(e) => validFormInput(e, ValidFormValidator.password, setErrorMsg)}
                            />
                        </FormInputContainer>

                        <div className={classes.popup__close} onClick={() => setShown(false)}>
                            <img src={popupCloseIcon} alt="ClosePopup"/>
                        </div>
                    </Form>

                </div>

            </div>
        </div>
    );
};

export default AccountFormPopup;