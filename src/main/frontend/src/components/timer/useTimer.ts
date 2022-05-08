import {useContext, useState} from "react";
import {AuthContext} from "../../context/AuthContext";
import {CsrfContext} from "../../context/CsrfContext";

export const useTimer = () => {
    const [timerValue, setTimerValue] = useState("00:00");
    const [timerLen, setTimerLen] = useState(0);
    const [isPlayingState, setIsPlayingState] = useState(false);

    const [popupContent, setPopupContent] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const authContext = useContext(AuthContext);
    const csrfContext = useContext(CsrfContext);
    return {timerValue, setTimerValue, timerLen, setTimerLen, isPlayingState, setIsPlayingState, popupContent, setPopupContent, showPopup,
        setShowPopup, authContext, csrfContext}
};