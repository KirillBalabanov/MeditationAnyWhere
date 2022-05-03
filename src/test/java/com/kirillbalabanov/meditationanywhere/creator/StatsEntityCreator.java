package com.kirillbalabanov.meditationanywhere.creator;

import com.kirillbalabanov.meditationanywhere.entity.StatsEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;

import java.sql.Date;

public class StatsEntityCreator {
    public static StatsEntity create(int id, int minListened, int sessionsListened, int currentStreak, int longestStreak, Date lastSessionsDate, UserEntity
            userEntity) {
        StatsEntity statsEntity = new StatsEntity();
        statsEntity.setId(id);
        statsEntity.setMinListened(minListened);
        statsEntity.setSessionsListened(sessionsListened);
        statsEntity.setCurrentStreak(currentStreak);
        statsEntity.setLongestStreak(longestStreak);
        statsEntity.setLastSessionsDate(lastSessionsDate);
        statsEntity.setUserEntity(userEntity);
        return statsEntity;
    }
}
