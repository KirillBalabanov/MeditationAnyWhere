import {createContext} from "react";

export interface CsrfContextI {
    csrfToken: string,
    setToken(token: string): void
}

export const CsrfContext = createContext<CsrfContextI | null>(null);