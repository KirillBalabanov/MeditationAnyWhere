export interface PrincipalI {
    username: string,
    email: string,
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
}

export interface AvatarFetchI {
    avatarUrl: string,
    avatar: File | null,
}

export interface VerificationFetchI {
    message: string
}

export interface EmailFetchI {
    email: string,
}