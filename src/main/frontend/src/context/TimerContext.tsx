import React, {createContext, Dispatch, FC, useContext, useReducer} from "react";
import {ContextProviderInterface} from "./ContextProviderInterface";
import {TimerAction, timerReducer, TimerState} from "../reducer/timerReducer";

const TimerContext = createContext<[TimerState, Dispatch<TimerAction>] | null>(null);

export const useTimerContextReducer = () => useContext(TimerContext);

const timerReducerInit: TimerState = {
    isPlaying: false,
    minListened: 0,
    sessionEnded: false,
    timerValue: 0,
    timerLenCurrent: 0,
    timerInterval: null,
}

export const TimerContextProvider: FC<ContextProviderInterface> = ({children}) => {

    const reducer = useReducer(timerReducer, timerReducerInit);

    return (
        <TimerContext.Provider value={reducer}>
            {children}
        </TimerContext.Provider>
    )
};