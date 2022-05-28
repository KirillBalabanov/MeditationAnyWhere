package com.kirillbalabanov.meditationanywhere.model;

import com.kirillbalabanov.meditationanywhere.entity.UserEntity;

public class PrincipalModel {
    private final String username;
    private final String email;
    private final String avatarUrl;

    private PrincipalModel(String username, String email, String avatarUrl) {
        this.username = username;
        this.email = email;
        this.avatarUrl = avatarUrl;
    }

    public static PrincipalModel toModel(UserEntity userEntity) {
        return new PrincipalModel(userEntity.getUsername(), userEntity.getEmail(), userEntity.getProfileEntity().getAvatarUrl());
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }
}
