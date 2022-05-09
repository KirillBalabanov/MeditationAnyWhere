import {useEffect} from "react";
import {CsrfContextI} from "../types/types";

export const useToken = (CsrfContextImp: CsrfContextI) => {
    useEffect(() => {
        let s = document.cookie.replace("^XSRF-TOKEN", '');
        CsrfContextImp.setToken( s.replace("XSRF-TOKEN=", ""));
    }, []);
};