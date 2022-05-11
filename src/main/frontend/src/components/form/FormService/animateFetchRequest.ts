import React, {SetStateAction} from "react";
import {FormStyles} from "../Form";

export const animateFetchRequest = (setIsLoading: React.Dispatch<SetStateAction<boolean>>, setFormClasses: React.Dispatch<SetStateAction<FormStyles[]>>, failed: boolean) => {
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
};