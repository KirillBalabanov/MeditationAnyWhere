import {usernameInvalidSymbolsRegex, usernameMaxLen, usernameRegex, usernameStartsWithRegex} from "./regex";

export const isValidUsername = (username: string): void  => {
    if (!usernameStartsWithRegex.test(username)) throw new Error("Username should start with 3 normal letters");
    if (username.length > usernameMaxLen) throw new Error("Username should be in range of " + usernameMaxLen +  " symbols");
    let allInvalidSymbols = username.match(usernameInvalidSymbolsRegex);
    if (allInvalidSymbols !== null) {
        throw new Error(allInvalidSymbols.map((str) => "'" + str + "'").join(" ") + " - invalid symbols in username");
    }
    let usrRegexArr = usernameRegex.exec(username);
    if (usrRegexArr === null || usrRegexArr[0] !== username) throw new Error("Invalid username.");
}