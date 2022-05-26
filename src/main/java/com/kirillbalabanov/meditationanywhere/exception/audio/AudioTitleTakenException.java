package com.kirillbalabanov.meditationanywhere.exception.audio;

public class AudioTitleTakenException extends AudioException {
    public AudioTitleTakenException(String message) {
        super(message);
    }

    public AudioTitleTakenException(String message, Throwable cause) {
        super(message, cause);
    }
}
