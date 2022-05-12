import {createContext, FC, useContext, useState} from "react";
import {ContextProviderInterface} from "./ContextProviderInterface";

export interface HeaderContextI {
    reload: boolean,
    setReload(b: boolean): void,
    showHeader: boolean,
    setShowHeader: (b: boolean) => void
}

const HeaderContext = createContext<HeaderContextI | null>(null);

export const useHeaderContext = () => {
    return useContext(HeaderContext);
}

export const HeaderContextProvider: FC<ContextProviderInterface> = ({children}) => {

    const [showHeader, setShowHeader] = useState(true);
    const [reloadHeader, setReloadHeader] = useState(false);
    const HeaderContextImp: HeaderContextI = {
        reload: reloadHeader,
        setReload: setReloadHeader,
        showHeader: showHeader,
        setShowHeader: setShowHeader
    }

    return (
        <HeaderContext.Provider value={HeaderContextImp}>
            {children}
        </HeaderContext.Provider>
    )
};