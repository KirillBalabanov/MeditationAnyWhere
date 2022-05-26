package com.kirillbalabanov.meditationanywhere.exception.user;

public class UsernameRegisteredException extends UserException {
    public UsernameRegisteredException(String message) {
        super(message);
    }

    public UsernameRegisteredException(String message, Throwable cause) {
        super(message, cause);
    }
}
