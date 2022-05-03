package com.kirillbalabanov.meditationanywhere.creator;

import com.kirillbalabanov.meditationanywhere.entity.StatsEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;

import java.sql.Date;

public class UserEntityCreator {
    public static UserEntity create(long id, String username, String encodedPassword, String email,
                                                               boolean isActivated, String verificationCode, StatsEntity statsEntity,
                                                               String role, Date date) {
        UserEntity userEntity = new UserEntity();
        userEntity.setId(id);
        userEntity.setUsername(username);
        userEntity.setPassword(encodedPassword);
        userEntity.setEmail(email);
        userEntity.setActivated(isActivated);
        userEntity.setActivationCode(verificationCode);
        userEntity.setStatsEntity(statsEntity);
        userEntity.setRole(role);
        userEntity.setRegistrationDate(date);
        return userEntity;
    }
}
