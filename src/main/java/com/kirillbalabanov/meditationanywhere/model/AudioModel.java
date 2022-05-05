package com.kirillbalabanov.meditationanywhere.model;

import com.kirillbalabanov.meditationanywhere.entity.AudioEntity;

public class AudioModel {
    private String audioUrl;
    private String audioTitle;

    public AudioModel() {
    }

    public static AudioModel toModel(AudioEntity audioEntity) {
        AudioModel audioModel = new AudioModel();
        audioModel.setAudioTitle(audioEntity.getAudioTitle());
        audioModel.setAudioUrl(audioEntity.getAudioUrl());
        return audioModel;
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public String getAudioTitle() {
        return audioTitle;
    }

    public void setAudioTitle(String audioTitle) {
        this.audioTitle = audioTitle;
    }
}
