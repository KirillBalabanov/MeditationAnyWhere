package com.kirillbalabanov.meditationanywhere.service;

import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.exception.user.RegistrationException;
import com.kirillbalabanov.meditationanywhere.repository.UserRepository;
import com.kirillbalabanov.meditationanywhere.util.validator.UserValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailSenderService emailSenderService;
    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailSenderService emailSenderService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailSenderService = emailSenderService;
    }

    /**
     * Registers current {@link UserEntity} in database.
     * Encrypts password with provided {@link PasswordEncoder}.
     * @param userEntity encapsulates raw password!
     * @return registered UserEntity.
     * @throws RegistrationException if username or email is taken.
     */

    public UserEntity register(UserEntity userEntity) throws RegistrationException {
        // validate UserEntity.
        UserValidator.isValidUsername(userEntity.getUsername());
        UserValidator.isValidPassword(userEntity.getPassword());
        if(userRepository.findByUsername(userEntity.getUsername()).isPresent()) throw new RegistrationException("Username is taken.");
        if(userRepository.findByEmail(userEntity.getEmail()).isPresent()) throw new RegistrationException("Email is already registered.");
        userEntity.setPassword(passwordEncoder.encode(userEntity.getPassword()));
        return userRepository.save(userEntity);
    }

    /**
     * Return {@link UserEntity} if found, otherwise throws {@link NoUserFoundException}
     * @return {@link UserEntity}
     * @throws NoUserFoundException ResponseStatus not found
     */
    public UserEntity findByUsername(String username) throws NoUserFoundException {
        Optional<UserEntity> optional = userRepository.findByUsername(username);
        if(optional.isEmpty()) throw new NoUserFoundException("User " + "'" + username + "'" + " not found.");
        return optional.get();
    }

    public boolean sendVerificationEmailTo(String uuid, String username, String email) {
        return emailSenderService.sendVerificationEmailUuidTo(uuid, username, email);
    }

    /**
     * Method is used to verify a user with given uuid.
     * Throws {@link NoUserFoundException} if no user with given uuid is found.
     */
    public void verify(String activationCode) throws NoUserFoundException{
        Optional<UserEntity> optional = userRepository.findByActivationCode(activationCode);
        if(optional.isEmpty()) throw new NoUserFoundException("Invalid activation code.");
        UserEntity userEntity = optional.get();
        userEntity.setActivated(true);
        userEntity.setActivationCode(null);
        userRepository.save(userEntity);
    }

    public boolean verifyPassword(String password, UserEntity userEntity) {
        return passwordEncoder.matches(password, userEntity.getPassword());
    }

    public boolean isVerified(UserEntity userEntity) {
        return userEntity.isActivated();
    }
}
