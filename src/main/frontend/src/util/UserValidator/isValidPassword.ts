import {
    passwordInvalidSymbolsRegex,
    passwordMaxLen,
    passwordMinLen,
    passwordRegex,
    passwordStartsWithRegex
} from "./regex";

export const isValidPassword = (password: string) => {
    if (!passwordStartsWithRegex.test(password)) throw new Error("Password should start with 3 normal letters");

    if (password.length < passwordMinLen || password.length > passwordMaxLen) throw new Error("Password should be in range of " +  passwordMinLen + "-" + passwordMaxLen + " symbols");
    let allInvalidSymbols = password.match(passwordInvalidSymbolsRegex);
    if (allInvalidSymbols !== null) {
        throw new Error(allInvalidSymbols.map((str) => "'" + str + "'").join(" ") + " - invalid symbols in password");
    }
    let arr = passwordRegex.exec(password);
    if (arr === null || arr[0] !== password) throw new Error("Invalid password.");
}