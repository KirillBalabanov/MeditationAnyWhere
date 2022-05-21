package com.kirillbalabanov.meditationanywhere.exception.user;

public class UsernameTakenException extends Exception {
    public UsernameTakenException(String message) {
        super(message);
    }
}
