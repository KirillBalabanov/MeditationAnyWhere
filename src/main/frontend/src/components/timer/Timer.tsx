import React, {FC, useContext, useEffect, useState} from 'react';
import classes from "./Timer.module.css";
import TimerService from "./TimerService";
import TimerSelect from "./TimerSelect";
import TimerSelectItem from "./TimerSelectItem";
import {AuthContext} from "../../context/AuthContext";
import {CsrfContext} from "../../context/CsrfContext";


interface TimerProps {
    isPlayingState: boolean,
    setIsPlayingState: (b: boolean) => void,
    setPopupContent: (content: string) => void,
    setShowPopup: (b: boolean) => void,
    audioToggle: React.RefObject<HTMLAudioElement>
}

let minListened = 0;
let min = 0;
let sec = 0;
let interval: NodeJS.Timer;
let timerLenDecrement = 0;
const timerLenDefault = 283;
const Timer: FC<TimerProps> = ({isPlayingState, setIsPlayingState, setPopupContent, setShowPopup, audioToggle}) => {

    const [timerValue, setTimerValue] = useState("00:00");
    const [timerLen, setTimerLen] = useState(0);
    const authContext = useContext(AuthContext);
    const csrfContext = useContext(CsrfContext);

    useEffect(() => {
        toggleTimer();
    }, [isPlayingState]);

    function stopTimer() {
        clearInterval(interval);
    }

    function timerRunFunc() {
        if (min === 0 && sec === 0) { // timer stop
            if(audioToggle != null) audioToggle.current!.play();
            setTimerValue(TimerService.formatToMinSecStr(0));
            timerLenCur = 0;
            setTimerLen(timerLenCur);
            stopTimer();
            if (authContext?.auth) { // update user stats
                fetch("/user/stats/updateStats", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "X-XSRF-TOKEN": csrfContext?.csrfToken!
                    },
                    body: JSON.stringify({minListened: minListened})
                })
            }
            setPopupContent("Listened " + minListened + " min.");
            setShowPopup(true);

            return;
        }

        if(sec == 0) {
            min--;
            sec = 60;
        }
        else sec--;

        setTimerValue(TimerService.formatToMinSecStr(min * 60 + sec));
        if(timerLenCur - timerLenDecrement <= 0) timerLenCur = 0;
        else timerLenCur -= timerLenDecrement;
        setTimerLen(timerLenCur);
    }

    function runTimer() {
        if(minListened - min == 0 && audioToggle != null) {
            audioToggle.current!.play();
        }

        interval = setInterval(() => {
            timerRunFunc();
        }, 30);
    }

    function toggleTimer() {
        if(min == 0 && sec == 0) return;

        if (isPlayingState) {
            stopTimer();
            return;
        }
        runTimer();
    }

    const selectCallback = (event: React.MouseEvent<HTMLDivElement>) => {
        if(isPlayingState) return;
        let el = event.target as Element;
        if(el == null || !el.hasAttribute("timer-value")) return;
        // @ts-ignore
        min = Number.parseInt(el.getAttribute("timer-value"));
        timerLenDecrement = timerLenDefault / (min * 60);
        minListened = min;
        timerLenCur = timerLenDefault;
        setTimerLen(timerLenCur);
        setTimerValue(TimerService.formatToMinSecStr(min * 60));
    }

    return (
        <div>
            <div className={classes.timer__timer}>
                <svg className={classes.timer__svg} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <circle className={classes.timer__circle} cx="50" cy="50" r="45"/>
                        <path
                            strokeDasharray={timerLenCur + " " + timerLenDefault} style={timerLenCur==0 ? {opacity: "0"} : {opacity: "100"}}
                            d="M 50, 50
                             m -45, 0
                             a 45,45 0 1,0 90,0
                             a 45,45 0 1,0 -90,0"
                        />
                    </g>
                </svg>
                <p>{timerValue}</p>
            </div>
            <TimerSelect onClickCallback={selectCallback}>
                <TimerSelectItem timerValue={1} />
                <TimerSelectItem timerValue={7} />
                <TimerSelectItem timerValue={10} />
                <TimerSelectItem timerValue={12} />
                <TimerSelectItem timerValue={15} />
                <TimerSelectItem timerValue={18} />
                <TimerSelectItem timerValue={20} />
                <TimerSelectItem timerValue={25} />
                <TimerSelectItem timerValue={30} />
                <TimerSelectItem timerValue={40} />
                <TimerSelectItem timerValue={50} />
                <TimerSelectItem timerValue={60} />
            </TimerSelect>
        </div>
    );
};

export default Timer;