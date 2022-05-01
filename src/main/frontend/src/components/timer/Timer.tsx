import React, {useEffect, useState} from 'react';
import classes from "./Timer.module.css";
import TimerSelect from "./TimerSelect";
import TimerImp from "./TimerImp";
import Popup from "../popup/Popup";

const Timer = () => {
    const [timerImp, setTimerImp] = useState(new TimerImp(0, 0, 45));
    const [timer, setTimer] = useState("00:00");
    const [popup, setPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("Listened");
    const [btnContent, setBtnContent] = useState("Start");

    function btnListener(event: React.MouseEvent<HTMLDivElement>) {
        if(timerImp.isRunning) {
            timerImp.isRunning = false;
            return;
        }
        timerImp.isRunning = true;
        setPopupContent("Listened " + timerImp.min.toString() + "min");
        let interval = setInterval(() => {
            setBtnContent("Stop");
            timerImp.decrement();
            setTimer(timerImp.buildString());
            if(!timerImp.isRunning) {
                clearInterval(interval);
                setBtnContent("Start");
                if (timerImp.buildString() == "00:00") {
                    timerImp.currentLen = 0;
                    setPopup(true);
                }
            }
        }, 100);
    }

    function selectListener(event: React.MouseEvent<HTMLDivElement>) {
        if(timerImp.isRunning) return;
        // change timer
        const target: Element = event.target as Element;
        if (target.className === classes.timer__select_item) {
            timerImp.setTimer(Number.parseInt(target.getAttribute("timer-value")!), 0);
            setTimer(timerImp.buildString());
        }
    }

    return (
        <div className={classes.timer}>
            <div className={classes.timer__timer}>
                <svg className={classes.timer__svg} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <circle className={classes.timer__circle} cx="50" cy="50" r="45"/>
                        <path
                            strokeDasharray={timerImp.currentLen + " 283"} style={timerImp.currentLen==0 ? {opacity: "0"} : {opacity: "100"}}
                            d="M 50, 50
                             m -45, 0
                             a 45,45 0 1,0 90,0
                             a 45,45 0 1,0 -90,0"
                        />
                    </g>
                </svg>
                <p>{timer}</p>
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
            <div className={classes.timer__btn} onClick={btnListener}>{btnContent}</div>
            <Popup popupInfo={popupContent} popupConfirm={"Ok"} active={popup} setStatus={setPopup}></Popup>
        </div>
    );
};

export default Timer;
