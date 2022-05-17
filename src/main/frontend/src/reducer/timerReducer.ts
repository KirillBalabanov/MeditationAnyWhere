
export enum TimerActionTypes {
    TOGGLE,
    PLAY,
    INIT_TIMER,
    TIMER_TICK,
    STOP,
    END,
    RESET,
}

interface TimerPlayAction {
    type: TimerActionTypes.PLAY,
    payload: {interval:
            NodeJS.Timer,
    }
}
interface TimerStopAction {
    type: TimerActionTypes.STOP,
}
interface TimerEndAction {
    type: TimerActionTypes.END,
}
interface TimerResetAction {
    type: TimerActionTypes.RESET,
}
interface TimerToggleAction {
    type: TimerActionTypes.TOGGLE,
}
interface TimerTickAction {
    type: TimerActionTypes.TIMER_TICK,
    payload: {
        newTimerValue: number,
        newTimerLen: number,
    }
}
interface TimerInitTimerAction {
    type: TimerActionTypes.INIT_TIMER,
    payload: {
        timerValue: number,
        minChose: number,
        timerLenDefault: number,
    }
}


export interface TimerState {
    isPlaying: boolean,
    timerValue: number,
    timerLenCurrent: number,
    minListened: number,
    timerInterval: NodeJS.Timer | null,
    sessionEnded: boolean,
}
export type TimerAction = TimerPlayAction | TimerStopAction | TimerEndAction | TimerTickAction| TimerInitTimerAction
    | TimerToggleAction | TimerResetAction;

export const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
    switch (action.type) {
        case TimerActionTypes.TOGGLE:
            return {...state, isPlaying: !state.isPlaying}

        case TimerActionTypes.PLAY:
            return {...state,
                isPlaying: true,
                timerInterval: action.payload.interval,
            }

        case TimerActionTypes.STOP:
            if(state.timerInterval !== null) clearInterval(state.timerInterval);
            return {...state, timerInterval: null, isPlaying: false}

        case TimerActionTypes.END:
            if(state.timerInterval !== null) clearInterval(state.timerInterval);
            return {...state, timerInterval: null, sessionEnded: true}

        case TimerActionTypes.RESET:
            return {...state, timerInterval: null, isPlaying: false, timerValue: 0, timerLenCurrent: 0, minListened: 0, sessionEnded: false}

        case TimerActionTypes.TIMER_TICK:
            return {...state, timerValue: action.payload.newTimerValue, timerLenCurrent: action.payload.newTimerLen}

        case TimerActionTypes.INIT_TIMER:
            return {...state, timerValue: action.payload.timerValue, timerLenCurrent: action.payload.timerLenDefault, minListened: action.payload.minChose}

        default:
            return state;
    }
};