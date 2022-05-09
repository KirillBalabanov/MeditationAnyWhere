import React, {useEffect} from 'react';
import classes from "../components/timer/Timer.module.css";
import TimerSelectItem from "../components/timer/TimerSelectItem";
import TimerService from "../components/timer/TimerService";
import Popup from "../components/popup/Popup";
import {useTimer} from "../components/timer/useTimer";
import Timer from "../components/timer/Timer";
import TimerSelect from "../components/timer/TimerSelect";
import TimerStartButton from "../components/timer/TimerStartButton";

let timerRunning = false;
let minListened = 0;
let min = 0;
let sec = 0;
let interval: NodeJS.Timer;
let timerLenDecrement = 0;
const timerLenDefault = 283;
let timerLenCur = 0;

const MainPage = () => {
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

    function timerRunFunc() {
        if(min == 0 && sec <= 10) { // audio volume decrement

        }

        if (min === 0 && sec === 0) { // timer stop
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
        timerRunning = true;
        setIsPlayingState(true);

        interval = setInterval(() => {
            timerRunFunc();
        }, 100);
    }

    function toggleTimer() {
        if(min == 0 && sec == 0) return;

        if (timerRunning) {
            stopTimer();
            return;
        }
        runTimer();
    }

    const selectCallback = (event: React.MouseEvent<HTMLDivElement>) => {
        if(timerRunning) return;
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
        <div className={classes.timer}>
            <Timer timerLenCurrent={timerLen} timerLenDefault={timerLenDefault} timerValue={timerValue}/>
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

            <TimerStartButton toggleTimerCallback={toggleTimer} isPlayingState={isPlayingState}/>
            <Popup popupInfo={popupContent} popupConfirm={"Ok"} shown={showPopup} setShown={setShowPopup}></Popup>
        </div>
    );
};

export default MainPage;
