import React, {FC, useState} from 'react';
import {WrapperInterface} from "./WrapperInterface";
import {HeaderContextI, HeaderContext} from "../context/HeaderContext";

const HeaderWrapper: FC<WrapperInterface> = React.memo(({children}) => {
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
    );
});

export default HeaderWrapper;