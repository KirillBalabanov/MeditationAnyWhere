package com.kirillbalabanov.meditationanywhere.model;

import com.kirillbalabanov.meditationanywhere.entity.StatsEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;

public class UserModel {
    private final String username;
    private final String email;

    private UserModel(String username, String email) {
        this.username = username;
        this.email = email;
    }

    public static UserModel toModel(UserEntity ue) {
        return new UserModel(ue.getUsername(), ue.getEmail());
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public boolean equals(Object obj) {
        if(this == obj) return true;

        if(!(obj instanceof UserModel ue)) return false;

        if(!this.getUsername().equals(ue.getUsername())) return false;
        if(!this.getEmail().equals(ue.getEmail())) return false;
        return true;
    }
}
