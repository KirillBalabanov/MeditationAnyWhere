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

// frontend types
export interface AuthContextI {
    auth: boolean,
    setAuth: (auth: boolean) => void,
    username: string,
    setUsername: (username: string) =>  void
}

export interface CsrfContextI {
    csrfToken: string,
    setToken:(token: string) => void
}

export interface HeaderReloadContextI {
    reload: boolean,
    setReload(b: boolean): void
}