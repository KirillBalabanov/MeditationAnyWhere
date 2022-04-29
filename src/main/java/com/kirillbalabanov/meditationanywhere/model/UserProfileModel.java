package com.kirillbalabanov.meditationanywhere.model;

import com.kirillbalabanov.meditationanywhere.entity.StatsEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;

public class UserProfileModel {
    private final long minListened;
    private final long sessionsListened;
    private final long currentStreak;
    private final long longestStreak;

    private final String username;

    public UserProfileModel(long minListened, long sessionsListened, long currentStreak, long longestStreak, String username) {
        this.minListened = minListened;
        this.sessionsListened = sessionsListened;
        this.currentStreak = currentStreak;
        this.longestStreak = longestStreak;
        this.username = username;
    }

    public static UserProfileModel toModel(StatsEntity se, UserEntity ue) {
        return new UserProfileModel(se.getMinListened(), se.getSessionsListened(), se.getCurrentStreak(), se.getLongestStreak(), ue.getUsername());
    }

    public long getMinListened() {
        return minListened;
    }

    public long getSessionsListened() {
        return sessionsListened;
    }

    public long getCurrentStreak() {
        return currentStreak;
    }

    public long getLongestStreak() {
        return longestStreak;
    }

    public String getUsername() {
        return username;
    }
}
