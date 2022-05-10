import {createContext} from "react";

export interface TimerContextI {
    isPlaying: boolean,
    setIsPlaying: (b: boolean) => void,
    timerValue: number,
    setTimerValue: (s: number) => void
    timerLenCurrent: number,
    setTimerLenCurrent: (n: number) => void,
    minListened: number,
    setMinListened: (n: number) => void,
    timerInterval: NodeJS.Timer | null,
    setTimerInterval: (s: NodeJS.Timer | null) => void,
}

export const TimerContext = createContext<TimerContextI | null>(null);