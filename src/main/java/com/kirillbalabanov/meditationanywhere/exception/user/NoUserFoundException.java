package com.kirillbalabanov.meditationanywhere.exception.user;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

public class NoUserFoundException extends Exception {
    public NoUserFoundException(String message) {
        super(message);
    }
}

