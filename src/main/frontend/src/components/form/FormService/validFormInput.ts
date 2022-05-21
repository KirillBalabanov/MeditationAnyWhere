import React, {SetStateAction} from "react";
import {isValidEmail} from "../../../util/UserValidator/isValidEmail";
import {isValidUsername} from "../../../util/UserValidator/isValidUsername";
import {isValidPassword} from "../../../util/UserValidator/isValidPassword";

export enum ValidFormValidator {
    username,
    email,
    password
}

export const validFormInput = (e: React.FormEvent<HTMLInputElement>, validForm: ValidFormValidator, setErrorMsg: React.Dispatch<SetStateAction<string | null>>) => {
    let val = (e.target as HTMLInputElement).value;
    try {
        switch (validForm) {
            case ValidFormValidator.username:
                isValidUsername(val);
                break
            case ValidFormValidator.email:
                isValidEmail(val);
                break
            case ValidFormValidator.password:
                isValidPassword(val);
                break
        }
        setErrorMsg(null);
    } catch (e) {
        if (e instanceof Error) setErrorMsg(e.message);
    }
}
