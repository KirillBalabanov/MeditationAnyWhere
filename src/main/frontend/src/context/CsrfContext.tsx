import {createContext, FC, useContext, useEffect, useState} from "react";
import {ContextProviderInterface} from "./ContextProviderInterface";

export interface CsrfContextI {
    csrfToken: string,
    setToken:(token: string) => void
}

const CsrfContext = createContext<CsrfContextI | null>(null);

export const useCsrfContext = () => useContext(CsrfContext);

export const CsrfContextProvider: FC<ContextProviderInterface> = ({children}) => {

    const [token, setToken] = useState("$token");
    const CsrfContextImp: CsrfContextI = {
        csrfToken: token,
        setToken: setToken
    }

    useEffect(() => {
        let s = document.cookie.replace("^XSRF-TOKEN", '');
        CsrfContextImp.setToken( s.replace("XSRF-TOKEN=", ""));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <CsrfContext.Provider value={CsrfContextImp}>
            {children}
        </CsrfContext.Provider>
    )
}