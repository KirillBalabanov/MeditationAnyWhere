class UserValidator {
    private static usernameStartsWithRegex: RegExp = /^[A-Za-z]{3,}/;
    private static usernameInvalidSymbolsRegex = /[^A-Za-z1-9 _.]/g;
    private static usernameMaxLen = 20;
    private static usernameRegex = /(?=[A-Za-z]{3,})[A-Za-z1-9 ._]{0,19}[A-Za-z1-9._]$/;

    private static emailRegex = /^\S+@\S+\.\S+$/;

    private static passwordRegex = /(?=[A-Za-z]{3,})[A-Za-z1-9 ._]{0,19}[A-Za-z1-9._]$/;
    private static passwordMaxLen = 25;
    private static passwordInvalidSymbolsRegex = /[^A-Za-z1-9 _.]/g;
    private static passwordStartsWithRegex: RegExp = /^[A-Za-z]{3,}/;


    public static isValidUsername(username: string): void {
        if (!this.usernameStartsWithRegex.test(username)) throw new Error("Username should start with 3 normal letters");
        if (username.length > this.usernameMaxLen) throw new Error("Username should be in range of " + this.usernameMaxLen +  " symbols");
        let allInvalidSymbols = username.match(this.usernameInvalidSymbolsRegex);
        if (allInvalidSymbols != null) {
            throw new Error(allInvalidSymbols.map((str) => "'" + str + "'").join(" ") + " - invalid symbols in username");
        }
        let usrRegexArr = this.usernameRegex.exec(username);
        if (usrRegexArr == null || usrRegexArr[0] != username) throw new Error("Invalid username.");
    }

    public static isValidEmail(email: string) {
        let arr = this.emailRegex.exec(email);
        if (arr == null || arr[0] != email) throw new Error("Invalid email");
    }

    public static isValidPassword(password: string) {
        if (!this.passwordStartsWithRegex.test(password)) throw new Error("Password should start with 3 normal letters");

        if (password.length > this.passwordMaxLen) throw new Error("Password should be in range of " + this.passwordMaxLen + " symbols");
        let allInvalidSymbols = password.match(this.passwordInvalidSymbolsRegex);
        if (allInvalidSymbols != null) {
            throw new Error(allInvalidSymbols.map((str) => "'" + str + "'").join(" ") + " - invalid symbols in password");
        }
        let arr = this.passwordRegex.exec(password);
        if (arr == null || arr[0] != password) throw new Error("Invalid password.");
    }
}

export default UserValidator;
