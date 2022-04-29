import {createContext} from "react";

export interface AuthContextI {
    auth: boolean,
    setAuth(auth: boolean): void,
    username: string,
    setUsername(username: string): void
}

export const AuthContext = createContext<AuthContextI | null>(null);