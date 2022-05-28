import React, {FC, useEffect, useMemo, useRef, useState} from 'react';
import classes from "./Timer.module.css";
import {formatToMinSecStr} from "./TimerService/formatToMinSecStr";
import {timerLenDefault} from "./TimerService/timerLenDefault";
import Popup from "../popup/Popup";
import AudioSource from "../audio/components/AudioSource";
import {useAudioSelectContext} from "../../context/AudioSelectContext";
import {useStore} from "../../context/CacheStore/StoreContext";
import {AudioFetchI, ErrorFetchI, StatsFetchI} from "../../types/serverTypes";
import {useTimerContextReducer} from "../../context/TimerContext";
import {TimerActionTypes} from "../../reducer/timerReducer";
import {UserActionTypes} from "../../reducer/userReducer";
import {ServerActionTypes} from "../../reducer/serverReducer";
import {csrfFetching, FetchContentTypes, FetchingMethods} from "../../util/Fetch/csrfFetching";

const Timer:FC = () => {

    const [timerState, timerDispatcher] = useTimerContextReducer()!;

    const cacheStore = useStore()!;
    const [authState] = cacheStore.authReducer;
    const [, userDispatcher] = cacheStore.userReducer;
    const [serverState, serverDispatcher] = cacheStore.serverReducer;

    const audioSelectContext = useAudioSelectContext();

    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState("");


    const toggleAudioElement = useRef<HTMLAudioElement | null>(null);



    let timerLenDecrement = useMemo(() => {
        return timerLenDefault / (timerState.minListened! * 60);
    }, [timerState.minListened]);


    useEffect(() => {
        fetch("/server/audios/toggle").then((response) => {
            return response.json()
        }).then((data: ErrorFetchI | AudioFetchI) => {
            if("errorMsg" in data) return;
            serverDispatcher({type: ServerActionTypes.ADD_TOGGLE_AUDIO, payload: {url: data.audioUrl, title: data.audioTitle}})
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (timerState.sessionEnded) {
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

            setPopupContent("Listened " + timerState.minListened + " min");
            setShowPopup(true);
            if (toggleAudioElement !== null) {
                toggleAudioElement.current?.play();
            }

            if (authState.auth) { // update user stats
                let body = JSON.stringify({minListened: timerState.minListened})

                csrfFetching("/users/current/stats/updateStats", FetchingMethods.PUT, FetchContentTypes.APPLICATION_JSON, body).then((response) => response.json()).then((data: ErrorFetchI | StatsFetchI) => {
                    if ("errorMsg" in data) {
                        return;
                    }
                    userDispatcher({type: UserActionTypes.SET_STATS, payload: data})
                });
            }

            timerDispatcher({type: TimerActionTypes.RESET})
        }
    }, [timerState.sessionEnded]); // eslint-disable-line react-hooks/exhaustive-deps


    useEffect(() => {
        const stopTimer = ()  => {
            timerDispatcher({type: TimerActionTypes.STOP})
        };

        const startTimer = () => {
            if(timerState.minListened! * 60 === timerState.timerValue) { // play on first start
                toggleAudioElement.current?.play();
            }

            let timerVal = timerState.timerValue;
            let timerLen = timerState.timerLenCurrent;
            let interval = setInterval(() => {

                if (timerVal === 0) {
                    timerDispatcher({type: TimerActionTypes.END})
                    return;
                }

                timerVal--;
                timerLen -= timerLenDecrement;
                if(timerLen < 0) timerLen = 0;

                timerDispatcher({type: TimerActionTypes.TIMER_TICK, payload: {
                        newTimerValue: timerVal,
                        newTimerLen: timerLen,
                    }})
            }, 100);

            timerDispatcher({type: TimerActionTypes.PLAY, payload: {
                interval: interval
                }})
        };

        if (!timerState.isPlaying) {
            stopTimer();
        } else {
            startTimer();
        }
    }, [timerState.isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <div>
            <div className={classes.timer__timer}>
                <svg className={classes.timer__svg} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <circle className={classes.timer__circle} cx="50" cy="50" r="45"/>
                        <path
                            strokeDasharray={timerState.timerLenCurrent + " " + 283} style={timerState.timerLenCurrent!<=1 ? {opacity: "0"} : {opacity: "100"}}
                            d="M 50, 50
                             m -45, 0
                             a 45,45 0 1,0 90,0
                             a 45,45 0 1,0 -90,0"
                        />
                    </g>
                </svg>
                <p>{formatToMinSecStr(timerState.timerValue)}</p>
            </div>
            {
                serverState.toggleAudio !== null &&
                <AudioSource audioUrl={serverState.toggleAudio.url} audioElement={toggleAudioElement}/>
            }
            <Popup popupInfo={popupContent} shown={showPopup} setShown={setShowPopup} popupConfirm={"Ok"}></Popup>
        </div>
    );
};

export default Timer;