import React, {createContext, SetStateAction} from "react";

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

export const TimerContext = createContext<TimerContextI | null>(null);