package com.kirillbalabanov.meditationanywhere.model;

import com.kirillbalabanov.meditationanywhere.entity.StatsEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;

import java.sql.Date;

public class UserProfileModel {
    private final long minListened;
    private final long sessionsListened;
    private final long currentStreak;
    private final long longestStreak;
    private final Date registrationDate;

    private final String username;

    public UserProfileModel(String username, long minListened, long sessionsListened, long currentStreak, long longestStreak, Date registrationDate) {
        this.username = username;
        this.minListened = minListened;
        this.sessionsListened = sessionsListened;
        this.currentStreak = currentStreak;
        this.longestStreak = longestStreak;
        this.registrationDate = registrationDate;
    }

    public static UserProfileModel toModel(StatsEntity se, UserEntity ue) {
        return new UserProfileModel(ue.getUsername(), se.getMinListened(), se.getSessionsListened(), se.getCurrentStreak(), se.getLongestStreak(), ue.getRegistrationDate());
    }

    public Date getRegistrationDate() {
        return registrationDate;
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
