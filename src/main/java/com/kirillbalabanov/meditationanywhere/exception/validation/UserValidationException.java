package com.kirillbalabanov.meditationanywhere.exception.validation;

public class UserValidationException extends ValidationException {
    public UserValidationException(String message) {
        super(message);
    }

    public UserValidationException(String message, Throwable cause) {
        super(message, cause);
    }

}
