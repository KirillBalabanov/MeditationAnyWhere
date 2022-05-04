package com.kirillbalabanov.meditationanywhere.model;

import com.kirillbalabanov.meditationanywhere.entity.ProfileEntity;

public class ProfileModel {
    private final String bio;
    private final String avatarUrl;

    public ProfileModel(String bio, String avatarUrl) {
        this.bio = bio;
        this.avatarUrl = avatarUrl;
    }

    public static ProfileModel toModel(ProfileEntity profileEntity) {
        return new ProfileModel(profileEntity.getBio(), profileEntity.getAvatarUrl());
    }

    public String getBio() {
        return bio;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }
}
