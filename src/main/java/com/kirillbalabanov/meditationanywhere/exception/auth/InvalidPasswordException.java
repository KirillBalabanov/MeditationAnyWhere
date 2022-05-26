package com.kirillbalabanov.meditationanywhere.exception.auth;

public class InvalidPasswordException extends AuthenticationException {
    public InvalidPasswordException(String message) {
        super(message);
    }
}
