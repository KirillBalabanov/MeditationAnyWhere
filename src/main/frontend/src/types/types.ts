export interface ErrorI {
    error: string
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
    registrationDate: Date
    bio: string,
    avatarUrl: string,
    username: string,
}

export interface AudioModelI {
    audioUrl: string,
    audioTitle: string,
}

export interface LoginI {
    authenticated: boolean,
    username: string,
    csrf: string
}