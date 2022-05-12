import React, {FC} from 'react';
import classes from "./Form.module.css";
import Loader from "../loader/Loader";

interface FormProps {
    children: React.ReactNode,
    submitCallback: (e: React.FormEvent) => void,
    isLoadingRequest: boolean,
    formStyle: FormStyles[],
    errorMsg: string,
    buttonTitle: string,
}

export enum FormStyles {
    loading = classes.loading,
    succeed = classes.succeed,
    failed = classes.failed
}

const Form: FC<FormProps> = (
    {
        children,
        submitCallback,
        isLoadingRequest,
        formStyle,
        errorMsg,
        buttonTitle
    }) => {


    return (
        <form className={classes.form + " " + formStyle.join(" ")} onSubmit={submitCallback}>
            {children}

            <p className={classes.form__error}>{errorMsg}</p>
            <div className={classes.form__btnOuter}>
                {
                    isLoadingRequest
                    &&
                    <Loader/>
                }
                <button type="submit" className={classes.form__btn}>{buttonTitle}</button>
            </div>
        </form>
    );
};

export default Form;