package com.kirillbalabanov.meditationanywhere.exception.user;

public class NoUserFoundException extends UserException {
    public NoUserFoundException(String message) {
        super(message);
    }

    public NoUserFoundException(String message, Throwable cause) {
        super(message, cause);
    }

}

