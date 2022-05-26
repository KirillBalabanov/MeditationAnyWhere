package com.kirillbalabanov.meditationanywhere.exception;

import com.kirillbalabanov.meditationanywhere.exception.audio.AudioNotFoundException;
import com.kirillbalabanov.meditationanywhere.exception.audio.AudioTitleTakenException;
import com.kirillbalabanov.meditationanywhere.exception.audio.InvalidAudioTitleException;
import com.kirillbalabanov.meditationanywhere.exception.auth.InvalidPasswordException;
import com.kirillbalabanov.meditationanywhere.exception.auth.UserNotVerifiedException;
import com.kirillbalabanov.meditationanywhere.exception.file.FolderNotExistsException;
import com.kirillbalabanov.meditationanywhere.exception.user.EmailRegisteredException;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.exception.user.UsernameRegisteredException;
import com.kirillbalabanov.meditationanywhere.exception.validation.ValidationException;
import com.kirillbalabanov.meditationanywhere.model.ErrorModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApplicationExceptionHandler {

    // user
    @ExceptionHandler(NoUserFoundException.class)
    public ResponseEntity<?> noUserFoundHandler(NoUserFoundException e) {
        return ResponseEntity.status(404).body(ErrorModel.fromMessage(e.getMessage()));
    }
    @ExceptionHandler(EmailRegisteredException.class)
    public ResponseEntity<?> emailRegisteredHandler(EmailRegisteredException e) {
        return ResponseEntity.status(409).body(ErrorModel.fromMessage(e.getMessage()));
    }
    @ExceptionHandler(UsernameRegisteredException.class)
    public ResponseEntity<?> usernameRegisteredHandler(UsernameRegisteredException e) {
        return ResponseEntity.status(409).body(ErrorModel.fromMessage(e.getMessage()));
    }

    // validation
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<?> validationExceptionHandler(ValidationException e) {
        return ResponseEntity.badRequest().body(ErrorModel.fromMessage(e.getMessage()));
    }

    // file
    @ExceptionHandler(FolderNotExistsException.class)
    public ResponseEntity<?> folderNotExistsException(FolderNotExistsException e) {
        return ResponseEntity.status(404).body(ErrorModel.fromMessage(e.getMessage()));
    }

    // auth
    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<?> invalidPasswordHandler(InvalidPasswordException e) {
        return ResponseEntity.status(401).body(ErrorModel.fromMessage(e.getMessage()));
    }
    @ExceptionHandler(UserNotVerifiedException.class)
    public ResponseEntity<?> userNotVerifiedHandler(UserNotVerifiedException e) {
        return ResponseEntity.status(403).body(ErrorModel.fromMessage(e.getMessage()));
    }

    // audio
    @ExceptionHandler(AudioNotFoundException.class)
    public ResponseEntity<?> audioNotFoundHandler(AudioNotFoundException e) {
        return ResponseEntity.status(404).body(ErrorModel.fromMessage(e.getMessage()));
    }
    @ExceptionHandler(AudioTitleTakenException.class)
    public ResponseEntity<?> audioTitleTakenHandler(AudioTitleTakenException e) {
        return ResponseEntity.status(409).body(ErrorModel.fromMessage(e.getMessage()));
    }
    @ExceptionHandler(InvalidAudioTitleException.class)
    public ResponseEntity<?> invalidAudioTitleHandler(InvalidAudioTitleException e) {
        return ResponseEntity.badRequest().body(ErrorModel.fromMessage(e.getMessage()));
    }

}
