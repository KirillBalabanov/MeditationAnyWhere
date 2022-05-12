import React, {createContext, FC, SetStateAction, useContext, useState} from "react";
import {ContextProviderInterface} from "./ContextProviderInterface";

export interface TimerContextI {
    isPlaying: boolean,
    setIsPlaying: React.Dispatch<SetStateAction<boolean>>
    timerValue: number,
    setTimerValue: React.Dispatch<SetStateAction<number>>
    timerLenCurrent: number,
    setTimerLenCurrent: React.Dispatch<SetStateAction<number>>
    minListened: number,
    setMinListened: React.Dispatch<SetStateAction<number>>
    timerInterval: NodeJS.Timer | null,
    setTimerInterval: React.Dispatch<SetStateAction<NodeJS.Timer | null>>
    audioPlaying: React.RefObject<HTMLAudioElement> | null,
    setAudioPlaying: React.Dispatch<SetStateAction<React.RefObject<HTMLAudioElement> | null>>,
    sessionEnded: boolean,
    setSessionEnded: React.Dispatch<SetStateAction<boolean>>,
}

const TimerContext = createContext<TimerContextI | null>(null);

export const useTimerContext = () => useContext(TimerContext);

export const TimerContextProvider: FC<ContextProviderInterface> = ({children}) => {

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
    )
};