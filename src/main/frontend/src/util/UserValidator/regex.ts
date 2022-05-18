export const usernameStartsWithRegex: RegExp = /^[A-Za-z]{3,}/;
export const usernameInvalidSymbolsRegex = /[^A-Za-z1-9 _.]/g;
export const usernameMaxLen = 20;
export const usernameRegex = /(?=[A-Za-z]{3,})[A-Za-z1-9 ._]{0,19}[A-Za-z1-9._]$/;

export const emailRegex = /^\S+@\S+\.\S+$/;

export const passwordRegex = /(?=[A-Za-z]{3,})[A-Za-z1-9 ._]{0,19}[A-Za-z1-9._]$/;
export const passwordMaxLen = 25;
export const passwordMinLen = 7;
export const passwordInvalidSymbolsRegex = /[^A-Za-z1-9 _.]/g;
export const passwordStartsWithRegex: RegExp = /^[A-Za-z]{3,}/;