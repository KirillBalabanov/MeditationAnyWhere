import {createContext} from "react";

export interface HeaderContextI {
    reload: boolean,
    setReload(b: boolean): void,
    showHeader: boolean,
    setShowHeader: (b: boolean) => void
}

export const HeaderContext = createContext<HeaderContextI | null>(null);