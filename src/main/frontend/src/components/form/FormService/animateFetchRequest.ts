import React, {SetStateAction} from "react";
import {FormState} from "../Form";

export const animateFetchRequest = (setFormClasses: React.Dispatch<SetStateAction<FormState>>, failed: boolean) => {
    // animation
    setTimeout(() => {
        if (failed) {
            setFormClasses(FormState.FAILED);
        } else {
            setFormClasses(FormState.SUCCEED);
        }
        setTimeout(() => {
            setFormClasses(FormState.DEFAULT);
        }, 500); // timeout for end of animation
    }, 300); // set timeout in case fetch request is very fast.
};