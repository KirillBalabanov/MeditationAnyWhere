import {createContext} from "react";

export interface HeaderReloadContextI {
    reload: boolean,
    setReload(b: boolean): void
}

export const HeaderReloadContext = createContext<HeaderReloadContextI | null>(null);