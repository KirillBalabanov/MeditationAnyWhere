package com.kirillbalabanov.meditationanywhere.exception.user;

public class InvalidPasswordException extends Exception {
    public InvalidPasswordException(String message) {
        super(message);
    }
}
