import React, {useState} from 'react';
import classes from "./Timer.module.css";
import TimerSelect from "./TimerSelect";
import TimerImp from "./TimerImp";
import Popup from "../popup/Popup";


let timerImp: TimerImp = new TimerImp(0, 0);

const Timer = () => {
    const [timer, setTimer] = useState("00:00");
    const [popup, setPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("Listened");

    function btnListener(event: React.MouseEvent<HTMLDivElement>) {
        setPopupContent("Listened " + timerImp.min.toString() + "min");
        const interval = setInterval(() => {
            timerImp.decrement();
            setTimer(timerImp.buildString());
            if(!timerImp.canRun()) {
                clearInterval(interval);
                setPopup(true);
            }
        }, 1);
    }

    function selectListener(event: React.MouseEvent<HTMLDivElement>) {
        // change timer
        const target: Element = event.target as Element;
        if (target.className === classes.timer__select_item) {
            timerImp.setTimer(Number.parseInt(target.getAttribute("timer-value")!), 0);
            setTimer(timerImp.buildString());
        }
    }

    return (
        <div className={classes.timer}>
            <div className={classes.timer__timer}>{timer}</div>
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
            <div className={classes.timer__btn} onClick={btnListener}>Start</div>
            <Popup popupInfo={popupContent} popupConfirm={"Ok"} active={popup} setStatus={setPopup}></Popup>
        </div>
    );
};

export default Timer;
