package com.kirillbalabanov.meditationanywhere.entity;

import javax.persistence.*;

@Entity
@Table(name = "audio")
public class AudioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column
    private String audioUrl;

    @Column
    private String audioPath;

    @Column
    private String audioTitle;

    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity userEntity;

    public static AudioEntity createAudioEntity(String audioTitle, String audioUrl, String audioPath, UserEntity userEntity) {
        AudioEntity audioEntity = new AudioEntity();
        audioEntity.setAudioTitle(audioTitle);
        audioEntity.setAudioUrl(audioUrl);
        audioEntity.setAudioPath(audioPath);
        audioEntity.setUserEntity(userEntity);
        return audioEntity;
    }
    public AudioEntity() {
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

    public String getAudioUrl() {
        return audioUrl;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public String getAudioPath() {
        return audioPath;
    }

    public void setAudioPath(String audioPath) {
        this.audioPath = audioPath;
    }

    public String getAudioTitle() {
        return audioTitle;
    }

    public void setAudioTitle(String audioTitle) {
        this.audioTitle = audioTitle;
    }
}

