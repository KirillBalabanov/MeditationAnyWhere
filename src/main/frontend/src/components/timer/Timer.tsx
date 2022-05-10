import React, {FC, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import classes from "./Timer.module.css";
import {TimerContext} from "./TimerContext";
import {formatToMinSecStr} from "./TimerService/formatToMinSecStr";
import {timerLenDefault} from "./TimerService/timerLenDefault";
import {AuthContext} from "../../context/AuthContext";
import {CsrfContext} from "../../context/CsrfContext";
import Popup from "../popup/Popup";

const Timer:FC = React.memo(() => {
    const timerContext = useContext(TimerContext);
    const authContext = useContext(AuthContext);
    const csrfContext = useContext(CsrfContext);
    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");

    let timerLenDecrement = useMemo(() => {
        return timerLenDefault / (timerContext?.minListened! * 60);
    }, [timerContext?.minListened]);

    useEffect(() => {
        if (!timerContext?.isPlaying) {
            stopTimer(timerContext?.timerInterval!);
        } else {
            startTimer(timerContext?.timerValue!, timerContext.timerLenCurrent);
        }
    }, [timerContext?.isPlaying]);


    const stopTimer = useCallback((interval: NodeJS.Timer | null)  => {
        if(interval == null) return;
        clearInterval(interval);
        timerContext?.setTimerInterval(null);
    }, []);

    const startTimer = useCallback((timerValue: number, currentTimerLen: number) => {

        let interval = setInterval(() => {
            if (timerValue == 0) { // session end
                clearInterval(interval);
                timerContext?.setIsPlaying(false);
                timerContext?.setTimerLenCurrent(0);
                setPopupContent("Listened " + timerContext?.minListened + " min");
                setShowPopup(true);
                if (authContext?.auth) { // update user stats
                    fetch("/user/stats/updateStats", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "X-XSRF-TOKEN": csrfContext?.csrfToken!
                        },
                        body: JSON.stringify({minListened: timerContext?.minListened})
                    })
                }
                return;
            }
            timerValue--;
            currentTimerLen -= timerLenDecrement;
            if(currentTimerLen <= 0) currentTimerLen = 0;
            timerContext?.setTimerValue(timerValue);
            timerContext?.setTimerLenCurrent(currentTimerLen);
        }, 10);

        timerContext?.setTimerInterval(interval);
    }, [timerLenDecrement]);

    return (
        <div>
            <div className={classes.timer__timer}>
                <svg className={classes.timer__svg} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <circle className={classes.timer__circle} cx="50" cy="50" r="45"/>
                        <path
                            strokeDasharray={timerContext?.timerLenCurrent + " " + 283} style={timerContext?.timerLenCurrent!<=1 ? {opacity: "0"} : {opacity: "100"}}
                            d="M 50, 50
                             m -45, 0
                             a 45,45 0 1,0 90,0
                             a 45,45 0 1,0 -90,0"
                        />
                    </g>
                </svg>
                <p>{formatToMinSecStr(timerContext?.timerValue!)}</p>
            </div>
            <Popup popupInfo={popupContent} shown={showPopup} setShown={setShowPopup} popupConfirm={"Ok"}></Popup>
        </div>
    );
});

export default Timer;