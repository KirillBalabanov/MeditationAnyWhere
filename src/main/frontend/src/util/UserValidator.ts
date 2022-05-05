export function isValidUsername(username: string): void {
    if (!/^[A-Za-z]{3,}/.test(username)) throw new Error("Username should start with 3 normal letters");
    if (username.length > 20) throw new Error("Username should be in range of 3-20 symbols");
    let allInvalidSymbols = username.match(/[^A-Za-z1-9 _.]/g);
    if (allInvalidSymbols != null) {
        throw new Error(allInvalidSymbols.map((str) => "'" + str + "'").join(" ") + " - invalid symbols in username");
    }
    if(/\s+$/.test(username)) throw new Error("Invalid username.");
}
export function isValidEmail(email: string) {
    if(!email.match("^\\S+@\\S+\\.\\S+$")) throw new Error("Invalid email");
}

export function isValidPassword(password: string) {
    if (password.length > 25 || password.length < 3) throw new Error("Password should be in range of 3-25 symbols");
    let allInvalidSymbols = password.match(/[^A-Za-z1-9 _.]/g);
    if (allInvalidSymbols != null) {
        throw new Error(allInvalidSymbols.map((str) => "'" + str + "'").join(" ") + " - invalid symbols in username");
    }
    if(/\s+$/.test(password)) throw new Error("Invalid password.");
}