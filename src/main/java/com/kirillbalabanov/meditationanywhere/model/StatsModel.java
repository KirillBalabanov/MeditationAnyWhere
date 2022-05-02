package com.kirillbalabanov.meditationanywhere.model;

import com.kirillbalabanov.meditationanywhere.entity.StatsEntity;

import java.sql.Date;

public class StatsModel {
    private int minListened;
    private int sessionsListened;
    private int currentStreak;
    private int longestStreak;
    private Date lastSessionsDate;

    public StatsModel() {
    }

    public StatsModel(int minListened, int sessionsListened, int currentStreak, int longestStreak, Date lastSessionsDate) {
        this.minListened = minListened;
        this.sessionsListened = sessionsListened;
        this.currentStreak = currentStreak;
        this.longestStreak = longestStreak;
        this.lastSessionsDate = lastSessionsDate;
    }

    public static StatsModel toModel(StatsEntity statsEntity) {
        return new StatsModel(statsEntity.getMinListened(), statsEntity.getSessionsListened(),
                statsEntity.getCurrentStreak(), statsEntity.getLongestStreak(), statsEntity.getLastSessionsDate());

    }

    public int getMinListened() {
        return minListened;
    }

    public int getSessionsListened() {
        return sessionsListened;
    }

    public int getCurrentStreak() {
        return currentStreak;
    }

    public int getLongestStreak() {
        return longestStreak;
    }

    public Date getLastSessionsDate() {
        return lastSessionsDate;
    }
}
