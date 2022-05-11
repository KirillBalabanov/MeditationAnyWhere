import React, {FC, useContext, useEffect, useMemo, useRef, useState} from 'react';
import classes from "./Timer.module.css";
import {TimerContext} from "../../context/TimerContext";
import {formatToMinSecStr} from "./TimerService/formatToMinSecStr";
import {timerLenDefault} from "./TimerService/timerLenDefault";
import {AuthContext} from "../../context/AuthContext";
import {CsrfContext} from "../../context/CsrfContext";
import Popup from "../popup/Popup";
import {AudioI, ErrorI} from "../../types/types";
import AudioSource from "../audio/components/AudioSource";
import {AudioSelectContext} from "../../context/AudioSelectContext";

const Timer:FC = React.memo(() => {
    const timerContext = useContext(TimerContext);
    const authContext = useContext(AuthContext);
    const csrfContext = useContext(CsrfContext);
    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");
    console.log(authContext);
    const [toggleAudioData, setToggleAudioData] = useState<AudioI | null | ErrorI>(null);
    const toggleAudioElement = useRef<HTMLAudioElement | null>(null);

    const audioSelectContext = useContext(AudioSelectContext);

    let timerLenDecrement = useMemo(() => {
        return timerLenDefault / (timerContext?.minListened! * 60);
    }, [timerContext?.minListened]);


    useEffect(() => {
        fetch("/server/audio/toggle").then((response) => response.json()).then((data: ErrorI | AudioI) => {
            setToggleAudioData(data);
        });
    }, []);

    useEffect(() => {
        if (timerContext?.sessionEnded) {
            if(audioSelectContext != null && audioSelectContext.isLibraryAudioOnPlay) { // smooth audio volume decrease
                let counter = 0;
                let interval = setInterval(() => {

                    if(audioSelectContext != null && audioSelectContext.isLibraryAudioOnPlay) {
                        if (audioSelectContext.currentAudioElement!.volume - 0.1 > 0) {
                            audioSelectContext.currentAudioElement!.volume -= 0.1;
                        } else {
                            counter = 9;
                        }
                    }

                    if (counter === 9) {
                        if(audioSelectContext != null && audioSelectContext.isLibraryAudioOnPlay) {
                            audioSelectContext?.currentAudioElement?.pause();
                            audioSelectContext.setIsLibraryAudioOnPlay(false);
                        }
                        clearInterval(interval);
                    }
                    counter++;
                }, 500);
            }
            setPopupContent("Listened " + timerContext?.minListened + " min");
            setShowPopup(true);
            if (toggleAudioData != null) {
                toggleAudioElement.current?.play();
            }
            if (authContext?.auth) { // update user stats
                fetch("/user/stats/updateStats", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "X-XSRF-TOKEN": csrfContext?.csrfToken!
                    },
                    body: JSON.stringify({minListened: timerContext?.minListened})
                });
            }
            timerContext.setSessionEnded(false);
        }
    }, [timerContext, audioSelectContext, toggleAudioData, authContext?.auth, csrfContext?.csrfToken]);


    useEffect(() => {
        const stopTimer = ()  => {
            if(timerContext?.timerInterval == null) return;
            clearInterval(timerContext.timerInterval);
            timerContext?.setTimerInterval(null);
        };

        const startTimer = () => {
            if(timerContext?.minListened! * 60 === timerContext?.timerValue && toggleAudioElement != null) {
                toggleAudioElement.current?.play();
            }

            let interval = setInterval(() => {

                timerContext?.setTimerValue(prev => {
                    if (prev === 0) { // session end
                        clearInterval(interval);
                        timerContext?.setIsPlaying(false);
                        timerContext?.setTimerLenCurrent(0);
                        timerContext?.setSessionEnded(true);
                        return 0;
                    }

                    return prev - 1;
                });
                timerContext?.setTimerLenCurrent(prev => {
                    if(prev - timerLenDecrement <= 0) return 0;
                    return prev - timerLenDecrement;
                });
            }, 100);

            timerContext?.setTimerInterval(interval);
        };

        if (!timerContext?.isPlaying) {
            stopTimer();
        } else {
            startTimer();
        }
    }, [timerContext?.isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps


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
            {
                toggleAudioData != null && "audioUrl" in toggleAudioData &&
                <AudioSource url={toggleAudioData.audioUrl} audioElement={toggleAudioElement}/>
            }
            <Popup popupInfo={popupContent} shown={showPopup} setShown={setShowPopup} popupConfirm={"Ok"}></Popup>
        </div>
    );
});

export default Timer;