package com.kirillbalabanov.meditationanywhere.model;

import com.kirillbalabanov.meditationanywhere.entity.ProfileEntity;
import com.kirillbalabanov.meditationanywhere.entity.StatsEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;

import java.sql.Date;

public class UserProfileModel {
    private final long minListened;
    private final long sessionsListened;
    private final long currentStreak;
    private final long longestStreak;
    private final Date registrationDate;
    private final String bio;
    private final String avatarFilePath;

    private final String username;

    public UserProfileModel(String username, long minListened, long sessionsListened, long currentStreak, long longestStreak, Date registrationDate, String bio, String avatarFilePath) {
        this.username = username;
        this.minListened = minListened;
        this.sessionsListened = sessionsListened;
        this.currentStreak = currentStreak;
        this.longestStreak = longestStreak;
        this.registrationDate = registrationDate;
        this.bio = bio;
        this.avatarFilePath = avatarFilePath;
    }

    public static UserProfileModel toModel(UserEntity ue, StatsEntity se, ProfileEntity pe) {
        return new UserProfileModel(ue.getUsername(), se.getMinListened(), se.getSessionsListened(),
                se.getCurrentStreak(), se.getLongestStreak(), ue.getRegistrationDate(), pe.getBio(),
                pe.getAvatarFilePath());
    }

    public Date getRegistrationDate() {
        return registrationDate;
    }

    public String getBio() {
        return bio;
    }

    public String getAvatarFilePath() {
        return avatarFilePath;
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
