package com.kirillbalabanov.meditationanywhere.entity;

import javax.persistence.*;
import java.sql.Date;

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

    @OneToOne(cascade = CascadeType.ALL, mappedBy = "userEntity")
    private StatsEntity statsEntity;

    public UserEntity() {
    }

    public UserEntity(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public UserEntity(String username, String password, String email, String role, boolean isActivated, String activationCode) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.isActivated = isActivated;
        this.activationCode = activationCode;
    }

    public void fillRegisteredUserFields(String encodedPassword, String role, String activationCode, StatsEntity statsEntity) {
        this.password = encodedPassword;
        this.role = role;
        this.activationCode = activationCode;
        this.statsEntity = statsEntity;
        this.isActivated = false;
        this.setRegistrationDate(new Date(new java.util.Date().getTime()));
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
