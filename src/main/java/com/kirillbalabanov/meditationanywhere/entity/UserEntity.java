package com.kirillbalabanov.meditationanywhere.entity;

import javax.persistence.*;
import java.sql.Date;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(nullable = false, unique = true)
    private String username;
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private boolean isActivated;

    @Column(nullable = true)
    private String activationCode;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private Date registrationDate;

    @OneToOne(cascade = CascadeType.ALL, mappedBy = "userEntity", fetch = FetchType.EAGER)
    private StatsEntity statsEntity;

    @OneToOne(cascade = CascadeType.ALL, mappedBy = "userEntity", fetch = FetchType.EAGER)
    private ProfileEntity profileEntity;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "userEntity", fetch = FetchType.EAGER)
    private List<AudioEntity> audioEntityList;

    public UserEntity() {
    }

    /**
     * Fabric method used to create an instance of brand new UserEntity, which then has to be saved in db.
     */
    public static UserEntity initUserEntity(String username, String email, String hashedPassword, String role) {
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(username);
        userEntity.setEmail(email);
        userEntity.setPassword(hashedPassword);
        userEntity.setRole(role);
        userEntity.setStatsEntity(StatsEntity.initStatsEntity());
        userEntity.setActivated(false);
        userEntity.setActivationCode(UUID.randomUUID().toString());
        userEntity.setRegistrationDate(new Date(new java.util.Date().getTime()));
        userEntity.setProfileEntity(ProfileEntity.initProfileEntity());
        userEntity.setAudioEntityList(new ArrayList<AudioEntity>());
        return userEntity;
    }

    public List<AudioEntity> getAudioEntityList() {
        return audioEntityList;
    }

    public void setAudioEntityList(List<AudioEntity> audioEntityList) {
        this.audioEntityList = audioEntityList;
    }

    public ProfileEntity getProfileEntity() {
        return profileEntity;
    }

    public void setProfileEntity(ProfileEntity profileEntity) {
        this.profileEntity = profileEntity;
    }

    public Date getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(Date registrationDate) {
        this.registrationDate = registrationDate;
    }

    public String getActivationCode() {
        return activationCode;
    }

    public void setActivationCode(String activationCode) {
        this.activationCode = activationCode;
    }

    public boolean isActivated() {
        return isActivated;
    }

    public void setActivated(boolean activated) {
        isActivated = activated;
    }

    public String getEmail() {
        return email;
    }

    public StatsEntity getStatsEntity() {
        return statsEntity;
    }

    public void setStatsEntity(StatsEntity statsEntity) {
        this.statsEntity = statsEntity;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public long getId() {
        return id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

}
