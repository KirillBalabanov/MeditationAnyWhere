import React, {useEffect} from 'react';
import classes from "./Timer.module.css";
import TimerSelect from "./TimerSelect";
import TimerService from "./TimerService";
import Popup from "../popup/Popup";
import btnStart from "../../images/startIcon.svg";
import btnStop from "../../images/stopIcon.svg";
import AudioSelect from "../select/audio/AudioSelect";
import {useTimer} from "./useTimer";

let timerRunning = false;
let minListened = 0;
let min = 0;
let sec = 0;
let interval: any;
let timerLenDecrement = 0;
const timerLenDefault = 283;
let timerLenCur = 0;

const Timer = () => {
    const {timerValue, setTimerValue, timerLen, setTimerLen, isPlayingState, setIsPlayingState, popupContent, setPopupContent, showPopup,
        setShowPopup, authContext, csrfContext} = useTimer();

    useEffect(() => {
        const keyListener = (e: KeyboardEvent) => {
            if(e.code == "Space")  {
                toggleTimer();
            }
        }
        window.addEventListener("keyup", keyListener);
        return () => {
            window.removeEventListener("keyup", keyListener);
        };
    }, []);

    function stopTimer() {
        clearInterval(interval);
        timerRunning = false;
        setIsPlayingState(false);
    }

    function runTimer() {
        timerRunning = true;
        setIsPlayingState(true);

        interval = setInterval(() => {
            if (min === 0 && sec === 0) { // timer stop
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
                setShowPopup(true);
            }
            if(sec == 0) {
                min--;
                sec = 60;
            }
            else sec--;

            setTimerValue(TimerService.formatToMinSecStr(min * 60 + sec));
            if(timerLenCur <= 0) timerLenCur = 0;
            else timerLenCur -= timerLenDecrement;
            setTimerLen(timerLenCur);
        }, 10);
    }

    function toggleTimer() {
        if(min == 0 && sec == 0) return;

        if (timerRunning) {
            stopTimer();
            return;
        }
        runTimer();
    }

    function selectListener(event: React.MouseEvent<HTMLDivElement>) {
        if(timerRunning) return;
        let el = event.target as Element;
        if(!el.hasAttribute("timer-value")) return;
        // @ts-ignore
        min = Number.parseInt(el.getAttribute("timer-value"));
        timerLenDecrement = timerLenDefault / (min * 60);
        minListened = min;
        setPopupContent("Listened " + minListened + " min.");
        timerLenCur = timerLenDefault;
        setTimerLen(timerLenCur);
        setTimerValue(TimerService.formatToMinSecStr(min * 60));
    }

    return (
        <div className={classes.timer}>
            <div className={classes.timer__timer}>
                <svg className={classes.timer__svg} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <circle className={classes.timer__circle} cx="50" cy="50" r="45"/>
                        <path
                            strokeDasharray={timerLen + " " + timerLenDefault} style={timerLen==0 ? {opacity: "0"} : {opacity: "100"}}
                            d="M 50, 50
                             m -45, 0
                             a 45,45 0 1,0 90,0
                             a 45,45 0 1,0 -90,0"
                        />
                    </g>
                </svg>
                <p>{timerValue}</p>
            </div>
            <div className={classes.timer__select} onClick={selectListener}>
                <TimerSelect timerValue={5} className={classes.timer__select_item}/>
                <TimerSelect timerValue={7} className={classes.timer__select_item}/>
                <TimerSelect timerValue={10} className={classes.timer__select_item}/>
                <TimerSelect timerValue={12} className={classes.timer__select_item}/>
                <TimerSelect timerValue={15} className={classes.timer__select_item}/>
                <TimerSelect timerValue={18} className={classes.timer__select_item}/>
                <TimerSelect timerValue={20} className={classes.timer__select_item}/>
                <TimerSelect timerValue={25} className={classes.timer__select_item}/>
                <TimerSelect timerValue={30} className={classes.timer__select_item}/>
                <TimerSelect timerValue={40} className={classes.timer__select_item}/>
                <TimerSelect timerValue={50} className={classes.timer__select_item}/>
                <TimerSelect timerValue={60} className={classes.timer__select_item}/>
            </div>
            <AudioSelect></AudioSelect>
            <div className={classes.timer__btn} onClick={() => toggleTimer()}>
                {
                    isPlayingState
                        ?
                        <img src={btnStop} alt="stop"/>
                        :
                        <img src={btnStart} alt="start"/>
                }

            </div>
            <Popup popupInfo={popupContent} popupConfirm={"Ok"} shown={showPopup} setShown={setShowPopup}></Popup>
        </div>
    );
};

export default Timer;
