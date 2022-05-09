import React, {FC} from 'react';
import classes from "./Form.module.css";

interface FormTitleProps {
    title: string
}

const FormTitle: FC<FormTitleProps> = ({title}) => {
    return (
        <h2 className={classes.form__title}>
            {title}
        </h2>
    );
};

export default FormTitle;