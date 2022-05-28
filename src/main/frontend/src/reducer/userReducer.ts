import {AudioInterface, AvatarInterface, BioInterface, StatsInterface} from "../types/contextTypes";
import {PrincipalI} from "../types/serverTypes";

export enum UserActionTypes {
    SET_PRINCIPAL,
    SET_USERNAME,
    SET_EMAIL,
    SET_BIO,
    SET_AVATAR,
    SET_REGISTRATION_DATE,
    SET_STATS,
    SET_AUDIO,

    RESET_AUDIO,
    RESET_ALL,
}

interface UserSetPrincipalAction {
    type: UserActionTypes.SET_PRINCIPAL,
    payload: PrincipalI,
}
interface UserSetUsernameAction {
    type: UserActionTypes.SET_USERNAME,
    payload: string,
}
interface UserSetBioAction {
    type: UserActionTypes.SET_BIO,
    payload: BioInterface,
}
interface UserSetAvatarAction {
    type: UserActionTypes.SET_AVATAR,
    payload: AvatarInterface,
}
interface UserSetRegistrationDateAction {
    type: UserActionTypes.SET_REGISTRATION_DATE,
    payload: string,
}
interface UserSetStatsAction {
    type: UserActionTypes.SET_STATS,
    payload: StatsInterface,
}
interface UserSetAudioAction {
    type: UserActionTypes.SET_AUDIO,
    payload: AudioInterface[],
}
interface UserSetEmailAction {
    type: UserActionTypes.SET_EMAIL,
    payload: string,
}

interface UserResetAudioAction {
    type: UserActionTypes.RESET_AUDIO,
}


interface UserResetAction {
    type: UserActionTypes.RESET_ALL
}



export type UserAction = UserSetPrincipalAction | UserSetBioAction |
    UserSetAvatarAction | UserSetRegistrationDateAction | UserSetStatsAction | UserSetAudioAction
    | UserResetAction | UserResetAudioAction | UserSetUsernameAction | UserSetEmailAction;

export interface UserState {
    username: string | null,
    email: string | null,
    avatar: AvatarInterface | null,
    bio: BioInterface | null,
    registrationDate: string | null,
    stats: StatsInterface | null,
    audio: AudioInterface[] | null,
}

export const userReducer = (state: UserState, action: UserAction): UserState => {
    switch (action.type) {
        // add
        case UserActionTypes.SET_PRINCIPAL:
            return {...state, username: action.payload.username, email: action.payload.email, avatar: {url: action.payload.avatarUrl}}
        case UserActionTypes.SET_USERNAME:
            return {...state, username: action.payload}
        case UserActionTypes.SET_BIO:
            return {...state, bio: action.payload}
        case UserActionTypes.SET_AVATAR:
            return {...state, avatar: action.payload}
        case UserActionTypes.SET_REGISTRATION_DATE:
            return {...state, registrationDate: action.payload}
        case UserActionTypes.SET_AUDIO:
            return {...state, audio: action.payload}
        case UserActionTypes.SET_STATS:
            return {...state, stats: action.payload}
        case UserActionTypes.SET_EMAIL:
            return {...state, email: action.payload}

        // resets
        case UserActionTypes.RESET_AUDIO:
            return {...state, audio: null}

        // full reset
        case UserActionTypes.RESET_ALL:
            return {username: null, avatar: null, bio: null, registrationDate: null, audio: null, stats: null, email: null}

        default:
            return state;
    }
};