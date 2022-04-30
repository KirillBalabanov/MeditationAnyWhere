import {useEffect, useState} from "react";
import {CsrfContextI} from "../context/CsrfContext";

export const useToken = (CsrfContextImp: CsrfContextI) => {
    useEffect(() => {
        let s = document.cookie.replace("^XSRF-TOKEN", '');
        CsrfContextImp.setToken( s.replace("XSRF-TOKEN=", ""));
    }, []);
};