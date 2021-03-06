import {AudioInterface, AudioWithRefInterface} from "../types/contextTypes";

export enum ServerActionTypes {
    ADD_TOGGLE_AUDIO,
    ADD_DEFAULT_AUDIO,
}

interface ServerAddToggleAudioAction {
    type: ServerActionTypes.ADD_TOGGLE_AUDIO
    payload: AudioWithRefInterface,
}
interface ServerAddDefaultAudioAction {
    type: ServerActionTypes.ADD_DEFAULT_AUDIO
    payload: AudioInterface[],
}



export type ServerAction = ServerAddToggleAudioAction | ServerAddDefaultAudioAction;

export interface ServerState {
    toggleAudio: AudioWithRefInterface | null,
    defaultAudio: AudioInterface[] | null,
}

export const serverReducer = (state: ServerState, action: ServerAction): ServerState => {
    switch (action.type) {
        case ServerActionTypes.ADD_TOGGLE_AUDIO:
            return {...state, toggleAudio: action.payload}

        case ServerActionTypes.ADD_DEFAULT_AUDIO:
            return {...state, defaultAudio: action.payload}

        default:
            return state;
    }
};