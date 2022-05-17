export interface AudioInterface {
    title: string,
    url: string,
}

export interface StatsInterface {
    minListened: number,
    sessionsListened: number,
    currentStreak: number,
    longestStreak: number,
}

export interface AvatarInterface {
    url: string | null,
}

export interface BioInterface {
    bio: string | null,
}
