import React, {FC, HTMLInputTypeAttribute} from 'react';
import classes from "./Form.module.css";

interface FormInputProps {
    setErrorMsg: (errMsg: string) => void,
    placeholder: string,
    type: HTMLInputTypeAttribute,
    name: string,
    onInput?: (e: React.FormEvent<HTMLInputElement>) => void
}

const FormInput: FC<FormInputProps> = React.memo((
    {
        setErrorMsg,
        placeholder,
        type,
        name,
        onInput
    }) => {


    return (
        <input type={type} name={name} className={classes.form__input} placeholder={placeholder}
               onInput={onInput}/>
    );
});

export default FormInput;