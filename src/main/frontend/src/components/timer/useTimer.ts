import {useState} from "react";

export const useTimer = () => {
    const [timerValue, setTimerValue] = useState("00:00");
    const [timerLen, setTimerLen] = useState(0);
    const [isPlayingState, setIsPlayingState] = useState(false);

    const [popupContent, setPopupContent] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    return {timerValue, setTimerValue, timerLen, setTimerLen, isPlayingState, setIsPlayingState, popupContent, setPopupContent, showPopup,
        setShowPopup}
};