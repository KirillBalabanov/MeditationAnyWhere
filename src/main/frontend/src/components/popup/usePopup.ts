import React, {SetStateAction, useEffect} from "react";

export const usePopup = (setShown: React.Dispatch<SetStateAction<boolean>>) => {
    useEffect(() => {
        const keyListener = (e: KeyboardEvent) => {
            if(e.code === "Escape") setShown(false);
        }
        window.addEventListener("keyup", keyListener);
        return () => {
            window.removeEventListener("keyup", keyListener);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
};