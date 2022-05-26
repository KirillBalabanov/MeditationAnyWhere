package com.kirillbalabanov.meditationanywhere.exception.audio;

import com.kirillbalabanov.meditationanywhere.exception.validation.ValidationException;

public class InvalidAudioTitleException extends ValidationException {
    public InvalidAudioTitleException(String message) {
        super(message);
    }
}
