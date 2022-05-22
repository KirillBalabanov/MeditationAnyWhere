import React, {FC} from 'react';
import classes from "./Form.module.css";
import Loader from "../loader/Loader";

interface FormProps {
    children: React.ReactNode,
    submitCallback: (e: React.FormEvent) => void,
    formState: FormState,
    errorMsg: string | null,
    buttonTitle: string,
}

export enum FormState {
    LOADING = classes.loading,
    DEFAULT = classes.default,
    SUCCEED = classes.succeed,
    FAILED = classes.failed,
}

const Form: FC<FormProps> = (
    {
        children,
        submitCallback,
        formState,
        errorMsg,
        buttonTitle
    }) => {

    return (
        <form className={classes.form + " " + formState} onSubmit={submitCallback}>
            {children}
            <p className={classes.form__error}>{errorMsg}</p>
            <div className={formState === FormState.LOADING ? classes.form__btnOuter + " " + classes.loading : classes.form__btnOuter}>
                <button type="submit" className={classes.form__btn}>{buttonTitle}</button>
            </div>

            <div className={formState === FormState.LOADING ? classes.loader + " " + classes.loading : classes.loader}>
                    <div className={formState === FormState.LOADING ? classes.loaderLoader + " " + classes.loading : classes.loaderLoader}>
                        {
                            formState === FormState.LOADING
                            &&
                            <Loader/>
                        }
                    </div>
            </div>
        </form>
    );
};

export default Form;