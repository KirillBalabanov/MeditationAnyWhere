import React, {FC, useState} from 'react';
import {WrapperInterface} from "./WrapperInterface";
import {CsrfContextI, CsrfContext} from "../context/CsrfContext";
import {useToken} from "../hooks/useToken";

const CsrfWrapper: FC<WrapperInterface> = React.memo(({children}) => {
    const [token, setToken] = useState("$token");
    const CsrfContextImp: CsrfContextI = {
        csrfToken: token,
        setToken: setToken
    }

    useToken(CsrfContextImp);

    return (
        <CsrfContext.Provider value={CsrfContextImp}>
            {children}
        </CsrfContext.Provider>
    );
});

export default CsrfWrapper;