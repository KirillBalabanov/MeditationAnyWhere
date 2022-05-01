package com.kirillbalabanov.meditationanywhere.entity;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "stats")
public class StatsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private long minListened;
    private long sessionsListened;
    private long currentStreak;
    private long longestStreak;

    @Column(nullable = true)
    private Date lastSessionsDate;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity userEntity;

    public StatsEntity() {
    }

    public StatsEntity(long id, long minListened, long sessionsListened, long currentStreak, long longestStreak, Date lastSessionsDate, UserEntity userEntity) {
        this.id = id;
        this.minListened = minListened;
        this.sessionsListened = sessionsListened;
        this.currentStreak = currentStreak;
        this.longestStreak = longestStreak;
        this.lastSessionsDate = lastSessionsDate;
        this.userEntity = userEntity;
    }

    /**
     * Fabric method creating an instance of StatsEntity, encapsulating:
     *<table>
     *<tr>
     *<th>Field in db</th>
     *<th>Value in entity</th>
     *</tr>
     * <tr>
     *     <td>min_listened</td>
     *     <td>0</td>
     * </tr>
     * <tr>
     *     <td>sessions_listened</td>
     *     <td>0</td>
     * </tr>
     * <tr>
     *     <td>current_streak</td>
     *     <td>0</td>
     * </tr>
     * <tr>
     *     <td>longest_streak</td>
     *     <td>0</td>
     * </tr>
     * <tr>
     *     <td>sessions_listened</td>
     *     <td>0</td>
     * </tr>
     * <tr>
     *     <td>last_sessions_date</td>
     *     <td>null</td>
     * </tr>
     *</table>
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

    public long getMinListened() {
        return minListened;
    }

    public void setMinListened(long minListened) {
        this.minListened = minListened;
    }

    public long getSessionsListened() {
        return sessionsListened;
    }

    public void setSessionsListened(long sessionsListened) {
        this.sessionsListened = sessionsListened;
    }

    public long getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(long currentStreak) {
        this.currentStreak = currentStreak;
    }

    public long getLongestStreak() {
        return longestStreak;
    }

    public void setLongestStreak(long longestStreak) {
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
