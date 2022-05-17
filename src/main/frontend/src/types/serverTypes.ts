export interface PrincipalI {
    username: string,
    authenticated: boolean,
}

export interface ErrorFetchI {
    errorMsg: string
}

export interface UserFetchI {
    username: string,
    email: string
}

export interface StatsFetchI {
    minListened : number,
    sessionsListened: number,
    currentStreak: number,
    longestStreak: number,
    lastSessionsDate: Date
}

export interface ProfileFetchI {
    bio: string | null,
    avatarUrl: string | null,
}

export interface UserProfileFetchI {
    minListened: number,
    sessionsListened: number,
    currentStreak: number,
    longestStreak: number,
    registrationDate: string,
    bio: string | null,
    avatarUrl: string | null,
    username: string,
}

export interface AudioFetchI {
    audioUrl: string,
    audioTitle: string,
}

export interface LoginFetchI {
    username: string,
    csrf: string
}

export interface AvatarFetchI {
    avatarUrl: string,
    avatar: File | null,
}

export interface CsrfFetchI {
    csrf: string,
}

export interface VerificationFetchI {
    message: string
}