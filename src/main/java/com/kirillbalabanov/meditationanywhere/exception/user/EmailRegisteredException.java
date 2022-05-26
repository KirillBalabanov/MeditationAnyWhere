package com.kirillbalabanov.meditationanywhere.exception.user;

public class EmailRegisteredException extends UserException {
    public EmailRegisteredException(String message) {
        super(message);
    }

    public EmailRegisteredException(String message, Throwable cause) {
        super(message, cause);
    }
}
