package com.kirillbalabanov.meditationanywhere.exception.audio;

public class AudioException extends RuntimeException {
    public AudioException(String message) {
        super(message);
    }

    public AudioException(String message, Throwable cause) {
        super(message, cause);
    }
}
