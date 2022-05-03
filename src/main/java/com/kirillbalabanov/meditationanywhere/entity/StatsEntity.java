package com.kirillbalabanov.meditationanywhere.entity;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "stats")
public class StatsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private int minListened;
    private int sessionsListened;
    private int currentStreak;
    private int longestStreak;

    @Column(nullable = true)
    private Date lastSessionsDate;

    @OneToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity userEntity;

    public StatsEntity() {
    }

    /**
     * Fabric method creating an instance of brand new StatsEntity, which then has to be saved in db.
     */
    public static StatsEntity initStatsEntity() {
        StatsEntity statsEntity = new StatsEntity();
        statsEntity.setCurrentStreak(0);
        statsEntity.setLongestStreak(0);
        statsEntity.setMinListened(0);
        statsEntity.setSessionsListened(0);
        statsEntity.setLastSessionsDate(null);
        return statsEntity;
    }

    public Date getLastSessionsDate() {
        return lastSessionsDate;
    }

    public void setLastSessionsDate(Date lastSessionsDate) {
        this.lastSessionsDate = lastSessionsDate;
    }

    public UserEntity getUserEntity() {
        return userEntity;
    }

    public void setUserEntity(UserEntity userEntity) {
        this.userEntity = userEntity;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getMinListened() {
        return minListened;
    }

    public void setMinListened(int minListened) {
        this.minListened = minListened;
    }

    public int getSessionsListened() {
        return sessionsListened;
    }

    public void setSessionsListened(int sessionsListened) {
        this.sessionsListened = sessionsListened;
    }

    public int getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(int currentStreak) {
        this.currentStreak = currentStreak;
    }

    public int getLongestStreak() {
        return longestStreak;
    }

    public void setLongestStreak(int longestStreak) {
        this.longestStreak = longestStreak;
    }

    @Override
    public boolean equals(Object obj) {
        if(this == obj) return true;

        if(!(obj instanceof StatsEntity se)) return false;

        if(this.getMinListened() != se.getMinListened()) return false;
        if(this.getSessionsListened() != se.getSessionsListened()) return false;
        if(this.getLongestStreak() != se.getLongestStreak()) return false;
        if(this.getCurrentStreak() != se.getCurrentStreak()) return false;
        if(this.getId() != se.getId()) return false;
        // sql.Date doesn't override equals.
        if(!this.lastSessionsDate.toString().equals(se.getLastSessionsDate().toString())) return false;

        return true;
    }
}
