import {CsrfContextI} from "../context/CsrfContext";
import {useEffect, useState} from "react";

export const useToken = () => {
    const [token, setToken] = useState("");
    const CsrfContextImp: CsrfContextI = {
        "csrfToken": token
    }
    useEffect(() => {
        let s = document.cookie.replace("^XSRF-TOKEN", '');
        setToken( s.replace("XSRF-TOKEN=", ""));
    }, []);
    return CsrfContextImp;
}