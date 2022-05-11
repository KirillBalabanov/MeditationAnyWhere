import {emailRegex} from "./regex";

export const isValidEmail = (email: string) => {
    let arr = emailRegex.exec(email);
    if (arr === null || arr[0] !== email) throw new Error("Invalid email");
}