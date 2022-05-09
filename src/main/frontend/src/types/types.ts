export interface ErrorI {
    errorMsg: string
}

export interface UserI {
    username: string,
    email: string
}

export interface StatsI {
    minListened : number,
    sessionsListened: number,
    currentStreak: number,
    longestStreak: number,
    lastSessionsDate: Date
}

export interface ProfileI {
    bio: string,
    avatarUrl: string
}

export interface UserProfileI {
    minListened: number,
    sessionsListened: number,
    currentStreak: number,
    longestStreak: number,
    registrationDate: string,
    bio: string,
    avatarUrl: string,
    username: string,
}

export interface AudioI {
    audioUrl: string,
    audioTitle: string,
}

export interface LoginI {
    authenticated: boolean,
    username: string,
    csrf: string
}

export interface AvatarI {
    avatarUrl: string
}

export interface CsrfI {
    csrf: string,
}

export interface VerificationI {
    message: string
}