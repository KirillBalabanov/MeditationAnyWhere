export function isValidUsername(username: string): void {
    if (!username.match("^[A-Za-z]{3,}")) throw new Error("Username should start with 3 normal letters");
    if (username.length > 20) throw new Error("Username should be in range of 20 symbols");
    if (username.match("[^1-9A-Za-z _.]")) {
        let s = username.replaceAll(/[1-9A-Za-z _.]/g, "");
        throw new Error(s + " - invalid symbols in username");
    }
}
export function isValidEmail(email: string) {
    if(!email.match("^\\S+@\\S+\\.\\S+$")) throw new Error("Invalid email");
}

export function isValidPassword(password: string) {
    if (password.length > 25 || password.length < 3) throw new Error("Password should be in range of 3-25 symbols");
    if (password.match("[^1-9A-Za-z _.]")) {
        let s = password.replaceAll(/[1-9A-Za-z _.]/g, "");
        throw new Error(s + " - invalid symbols in password");
    }
}