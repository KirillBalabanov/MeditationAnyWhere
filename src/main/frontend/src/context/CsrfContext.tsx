import {createContext} from "react";

export interface CsrfContextI {
    csrfToken: string
}

export const CsrfContext = createContext<CsrfContextI | null>(null);