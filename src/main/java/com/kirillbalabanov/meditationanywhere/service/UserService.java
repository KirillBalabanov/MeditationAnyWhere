package com.kirillbalabanov.meditationanywhere.service;

import com.kirillbalabanov.meditationanywhere.entity.StatsEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.exception.user.LoginException;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.exception.user.RegistrationException;
import com.kirillbalabanov.meditationanywhere.repository.UserRepository;
import com.kirillbalabanov.meditationanywhere.util.validator.UserValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

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
     * @return registered UserEntity.
     * @throws RegistrationException if username or email is taken.
     */

    public UserEntity register(UserEntity userEntity) throws RegistrationException {
        validateInput(userEntity.getUsername(), userEntity.getEmail(), userEntity.getPassword());
        if(userRepository.findByUsername(userEntity.getUsername()).isPresent()) throw new RegistrationException("Username is taken.");
        if(userRepository.findByEmail(userEntity.getEmail()).isPresent()) throw new RegistrationException("Email is already registered.");

        String uuid = UUID.randomUUID().toString();
        userEntity.fillRegisteredUserFields(passwordEncoder.encode(userEntity.getPassword()), "ROLE_USER", uuid, StatsEntity.initStatsEntity());
        emailSenderService.sendVerificationEmailUuidTo(uuid, userEntity.getUsername(), userEntity.getEmail());

        return userRepository.save(userEntity);
    }

    /**
     * Defines if user is able to log in. Throws exception if not.
     * @param username username
     * @param rawPassword input password
     * @throws NoUserFoundException - if there is no user in db.
     * @throws LoginException - if password doesn't match or account is not verified.
     */
    public void isAbleToLogIn(String username, String rawPassword) throws NoUserFoundException, LoginException, RegistrationException {
        validateInput(username, rawPassword);
        Optional<UserEntity> optional = userRepository.findByUsername(username);
        if(optional.isEmpty()) throw new NoUserFoundException("User not found.");
        UserEntity userEntity = optional.get();
        if (!passwordEncoder.matches(rawPassword, userEntity.getPassword())) throw new LoginException("Invalid password");
        if (!userEntity.isActivated()) throw new LoginException("Account is not verified");
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

    /**
     * Method is used to verify a user with given uuid.
     * Throws {@link NoUserFoundException} if no user with given uuid is found.
     */
    public void verifyUserByActivationCode(String activationCode) throws NoUserFoundException{
        Optional<UserEntity> optional = userRepository.findByActivationCode(activationCode);
        if(optional.isEmpty()) throw new NoUserFoundException("Invalid activation code.");
        UserEntity userEntity = optional.get();
        userEntity.setActivated(true);
        userEntity.setActivationCode(null);
        userRepository.save(userEntity);
    }
    private void validateInput(String username, String password) throws RegistrationException {
        UserValidator.isValidUsername(username);
        UserValidator.isValidPassword(password);
    }

    private void validateInput(String username, String email, String password) throws RegistrationException {
        UserValidator.isValidUsername(username);
        UserValidator.isValidEmail(email);
        UserValidator.isValidPassword(password);
    }
}
