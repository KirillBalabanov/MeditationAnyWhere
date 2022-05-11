import React, {FC, useState} from 'react';
import {TimerContext, TimerContextI} from "../context/TimerContext";
import {WrapperInterface} from "./WrapperInterface";

const TimerWrapper: FC<WrapperInterface> = React.memo(({children}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [timerValue, setTimerValue] = useState(0);
    const [timerLenCurrent, setTimerLenCurrent] = useState(0);
    const [minListened, setMinListened] = useState(0);
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timer | null>(null);
    const [audioPlaying, setAudioPlaying] = useState<React.RefObject<HTMLAudioElement> | null>(null);
    const [sessionEnded, setSessionEnded] = useState(false);
    const TimerContextImp: TimerContextI = {
        isPlaying: isPlaying,
        setIsPlaying: setIsPlaying,
        timerValue: timerValue,
        setTimerValue: setTimerValue,
        timerLenCurrent: timerLenCurrent,
        setTimerLenCurrent: setTimerLenCurrent,
        minListened: minListened,
        setMinListened: setMinListened,
        timerInterval: timerInterval,
        setTimerInterval: setTimerInterval,
        audioPlaying: audioPlaying,
        setAudioPlaying: setAudioPlaying,
        sessionEnded: sessionEnded,
        setSessionEnded: setSessionEnded
    }

    return (
        <TimerContext.Provider value={TimerContextImp}>
            {children}
        </TimerContext.Provider>
    );
});

export default TimerWrapper;