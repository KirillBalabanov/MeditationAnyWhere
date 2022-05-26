package com.kirillbalabanov.meditationanywhere.exception.audio;

public class AudioNotFoundException extends AudioException {
    public AudioNotFoundException(String message) {
        super(message);
    }

    public AudioNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

}
