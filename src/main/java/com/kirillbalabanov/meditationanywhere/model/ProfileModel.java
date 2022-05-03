package com.kirillbalabanov.meditationanywhere.model;

import com.kirillbalabanov.meditationanywhere.entity.ProfileEntity;

public class ProfileModel {
    private final String bio;
    private final String avatarPath;

    public ProfileModel(String bio, String avatarPath) {
        this.bio = bio;
        this.avatarPath = avatarPath;
    }

    public static ProfileModel toModel(ProfileEntity profileEntity) {
        return new ProfileModel(profileEntity.getBio(), profileEntity.getAvatarFilePath());
    }

    public String getBio() {
        return bio;
    }

    public String getAvatarPath() {
        return avatarPath;
    }
}
