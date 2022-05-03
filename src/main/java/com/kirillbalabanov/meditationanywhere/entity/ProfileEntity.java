package com.kirillbalabanov.meditationanywhere.entity;

import javax.persistence.*;

@Entity
@Table(name = "profile")
public class ProfileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = true)
    private String avatarFilePath;

    @Column(nullable = true)
    private String bio;

    @OneToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity userEntity;

    public ProfileEntity() {
    }

    public static ProfileEntity initProfileEntity() {
        ProfileEntity profileEntity = new ProfileEntity();
        profileEntity.setBio("");
        profileEntity.setAvatarFilePath("");
        return profileEntity;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public UserEntity getUserEntity() {
        return userEntity;
    }

    public void setUserEntity(UserEntity userEntity) {
        this.userEntity = userEntity;
    }

    public String getAvatarFilePath() {
        return avatarFilePath;
    }

    public void setAvatarFilePath(String avatarFilePath) {
        this.avatarFilePath = avatarFilePath;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }
}
