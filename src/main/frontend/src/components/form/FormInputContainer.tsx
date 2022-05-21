import React, {FC} from 'react';
import classes from "./Form.module.css";

interface FormInputContainerProps {
    children: React.ReactNode,
}

const FormInputContainer: FC<FormInputContainerProps> = ({children}) => {
    return (
        <div className={classes.form__inputContainer}>
            {children}
        </div>
    );
};

export default FormInputContainer;