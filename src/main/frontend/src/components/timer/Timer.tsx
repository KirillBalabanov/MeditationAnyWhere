import React, {useContext, useEffect, useState} from 'react';
import classes from "./Timer.module.css";
import TimerSelect from "./TimerSelect";
import TimerImp from "./TimerImp";
import Popup from "../popup/Popup";
import btnStart from "../../images/startIcon.svg";
import btnStop from "../../images/stopIcon.svg";
import TimerService from "./TimerService";
import {AuthContext} from "../../context/AuthContext";
import {CsrfContext} from "../../context/CsrfContext";

const Timer = () => {
    const [timer, setTimer] = useState("00:00");
    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("Listened");
    const [minListened, setMinListened] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [sessionEnded, setSessionEnded] = useState(false);
    const authContext = useContext(AuthContext)!;
    const csrfContext = useContext(CsrfContext)!;

    useEffect(() => {
        if(!sessionEnded) return;
        if(minListened === 0) return;

        setPopupContent("Listened " + minListened + " min.");
        setShowPopup(true);
        if(!authContext.auth) {
            return;
        }
        fetch("/updateStats", { method: "PUT", headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': csrfContext.csrfToken
            },
            body: JSON.stringify({
                minListened: minListened
            })
        });
        setSessionEnded(false);

    }, [sessionEnded]);


    const [timerService, setTimerService] = useState(new TimerService(new TimerImp(0, 0, 45), setMinListened, setTimer, setTimerRunning, setSessionEnded));

    useEffect(() => {
        const keyListener = (e: KeyboardEvent) => {
            if (e.code === "Space") toggleTimer();
            if(e.code == "Escape") setShowPopup(false);
        }
        window.addEventListener("keyup", keyListener);
        return () => {
            window.removeEventListener("keyup", keyListener);
        };
    }, []);

    function toggleTimer() {
        if (timerService.isRunning()) {
            timerService.stop();
            return;
        }
        try {
            timerService.run();
        } catch (e) {
            return;
        }
    }

    function selectListener(event: React.MouseEvent<HTMLDivElement>) {
        if(timerService.isRunning()) return;

        const target: Element = event.target as Element;
        if (target.className === classes.timer__select_item) {
            timerService.setTimerValues(Number.parseInt(target.getAttribute("timer-value")!), 0);
            setTimer(timerService.getTimerValues());
        }
    }

    return (
        <div className={classes.timer}>
            <div className={classes.timer__timer}>
                <svg className={classes.timer__svg} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <circle className={classes.timer__circle} cx="50" cy="50" r="45"/>
                        <path
                            strokeDasharray={timerService.getTimerLen() + " 283"} style={timerService.getTimerLen()==0 ? {opacity: "0"} : {opacity: "100"}}
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
            <div className={classes.timer__btn} onClick={() => toggleTimer()}>
                {
                    timerRunning
                        ?
                        <img src={btnStop} alt="stop"/>
                        :
                        <img src={btnStart} alt="start"/>
                }

            </div>
            <Popup popupInfo={popupContent} popupConfirm={"Ok"} active={showPopup} setStatus={setShowPopup}></Popup>
        </div>
    );
};

export default Timer;
