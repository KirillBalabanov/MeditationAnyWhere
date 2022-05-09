import {FormStyles} from "./Form";
import React from "react";
import UserValidator from "../../util/UserValidator";

class FormService {
    static animateFetchRequest(setIsLoading: (b: boolean) => void, setFormClasses: (arr: FormStyles[]) => void, failed: boolean) {
        // animation
        setTimeout(() => {
            setFormClasses([]);
            setIsLoading(false);
            if (failed) {
                setFormClasses([FormStyles.failed]);
            } else {
                setFormClasses([FormStyles.succeed]);
            }
            setTimeout(() => {
                setFormClasses([]);
            }, 500); // timeout for end of animation
        }, 300); // set timeout in case fetch request is very fast.
    }

    static validFormInput(e: React.FormEvent<HTMLInputElement>, validForm: ValidFormValidator, setErrorMsg: (msg: string) => void) {
        let val = (e.target as HTMLInputElement).value;
        try {
            switch (validForm) {
                case ValidFormValidator.username:
                    UserValidator.isValidUsername(val);
                    break
                case ValidFormValidator.email:
                    UserValidator.isValidEmail(val);
                    break
                case ValidFormValidator.password:
                    UserValidator.isValidPassword(val);
                    break
            }
            setErrorMsg("");
        } catch (e) {
            if (e instanceof Error) setErrorMsg(e.message);
        }
    }
}

export enum ValidFormValidator {
    username,
    email,
    password
}

export default FormService;