package com.kirillbalabanov.meditationanywhere.exception.auth;

public class UserNotVerifiedException extends AuthenticationException {
    public UserNotVerifiedException(String message) {
        super(message);
    }
}
