package com.kirillbalabanov.meditationanywhere.service;

import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.exception.user.*;
import com.kirillbalabanov.meditationanywhere.model.EmailModel;
import com.kirillbalabanov.meditationanywhere.model.UserModel;
import com.kirillbalabanov.meditationanywhere.repository.UserRepository;
import com.kirillbalabanov.meditationanywhere.util.validator.UserValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailSenderService emailSenderService;
    private final UUIDCryptor uuidCryptor;

    private final FileService fileService;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailSenderService emailSenderService, UUIDCryptor uuidCryptor, FileService fileService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailSenderService = emailSenderService;
        this.uuidCryptor = uuidCryptor;
        this.fileService = fileService;
    }

    /**
     * Registers current {@link UserEntity} in database.
     * Encrypts password with provided {@link PasswordEncoder}.
     *
     * @return registered UserEntity.
     * @throws ValidationException if username or email is taken.
     */

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public UserEntity register(String username, String email, String password) throws ValidationException {

        UserValidator.isValidUsername(username);
        UserValidator.isValidEmail(email);
        UserValidator.isValidPassword(password);
        if (userRepository.findByUsername(username).isPresent()) throw new ValidationException("Username is taken.");
        if (userRepository.findByEmail(email).isPresent())
            throw new ValidationException("Email is already registered.");

        String activationCode = uuidCryptor.hexEncryption(username);

        UserEntity newUserEntity = UserEntity.initUserEntity(username, email, activationCode, passwordEncoder.encode(password), "ROLE_USER");

        emailSenderService.sendVerificationEmail(newUserEntity.getActivationCode(), email, username);

        newUserEntity.getStatsEntity().setUserEntity(newUserEntity); // bind stats to user
        newUserEntity.getProfileEntity().setUserEntity(newUserEntity); // bind profile to user

        return userRepository.save(newUserEntity);
    }

    /**
     * Defines if user is able to log in. Throws exception if not.
     *
     * @param username    username
     * @param rawPassword input password
     * @throws NoUserFoundException - if there is no user in db.
     * @throws LoginException       - if password doesn't match or account is not verified.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public UserModel isAbleToLogIn(String username, String rawPassword) throws NoUserFoundException, LoginException, ValidationException, InvalidPasswordException {
        UserValidator.isValidUsername(username);
        UserValidator.isValidPassword(rawPassword);
        Optional<UserEntity> optional = userRepository.findByUsername(username);
        if (optional.isEmpty()) throw new NoUserFoundException("User not found.");
        UserEntity userEntity = optional.get();
        if (!passwordEncoder.matches(rawPassword, userEntity.getPassword()))
            throw new InvalidPasswordException("Invalid password");
        if (!userEntity.isActivated()) throw new LoginException("Account is not verified");
        return UserModel.toModel(userEntity);
    }

    /**
     * Return {@link UserEntity} if found, otherwise throws {@link NoUserFoundException}
     *
     * @return {@link UserEntity}
     * @throws NoUserFoundException ResponseStatus not found
     */
    @Transactional(readOnly = true)
    public UserEntity findByUsername(String username) throws NoUserFoundException {
        Optional<UserEntity> optional = userRepository.findByUsername(username);
        if (optional.isEmpty()) throw new NoUserFoundException("User " + "'" + username + "'" + " not found.");
        return optional.get();
    }

    @Transactional(readOnly = true)
    public UserEntity findById(long id) throws NoUserFoundException {
        Optional<UserEntity> optional = userRepository.findById(id);
        if (optional.isEmpty()) throw new NoUserFoundException("No user found.");
        return optional.get();
    }

    /**
     * Method is used to verify a user with given uuid.
     * Throws {@link NoUserFoundException} if no user with given uuid is found.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void verifyUserByActivationCode(String activationCode) throws NoUserFoundException {
        Optional<UserEntity> optional = userRepository.findByActivationCode(activationCode);
        if (optional.isEmpty()) throw new NoUserFoundException("Invalid activation code.");
        UserEntity userEntity = optional.get();
        userEntity.setActivated(true);
        userEntity.setActivationCode(null);
        userRepository.save(userEntity);
    }

    @Transactional(readOnly = true)
    public UserModel getPrincipal(long userId) throws NoUserFoundException {
        Optional<UserEntity> optional = userRepository.findById(userId);
        if (optional.isEmpty()) throw new NoUserFoundException("No user found");
        return UserModel.toModel(optional.get());
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public UserModel changeUsername(long id, String newUsername, String rawPassword) throws ValidationException, NoUserFoundException, UsernameTakenException, InvalidPasswordException {
        UserValidator.isValidUsername(newUsername);
        Optional<UserEntity> optional = userRepository.findById(id);
        if (optional.isEmpty()) throw new NoUserFoundException("No user found.");
        UserEntity userEntity = optional.get();
        if (!passwordEncoder.matches(rawPassword, userEntity.getPassword()))
            throw new InvalidPasswordException("Invalid password.");

        if (userRepository.findByUsername(newUsername).isPresent())
            throw new UsernameTakenException("Username is taken.");
        userEntity.setUsername(newUsername);
        return UserModel.toModel(userRepository.save(userEntity));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public UserModel changeEmailRequest(long userId, String newEmail, String rawPassword) throws ValidationException, NoUserFoundException, InvalidPasswordException, EmailRegisteredException {
        UserValidator.isValidEmail(newEmail);
        Optional<UserEntity> optionalEmail = userRepository.findByEmail(newEmail);
        if(optionalEmail.isPresent()) throw new EmailRegisteredException("Email is already registered.");
        Optional<UserEntity> optional = userRepository.findById(userId);
        if (optional.isEmpty()) throw new NoUserFoundException("No user found.");
        UserEntity userEntity = optional.get();
        if (!passwordEncoder.matches(rawPassword, userEntity.getPassword()))
            throw new InvalidPasswordException("Invalid password.");

        if (userEntity.getEmail().equals(newEmail)) throw new ValidationException("Email already in use.");

        String activationCode = uuidCryptor.hexEncryption(newEmail);

        emailSenderService.sendChangeEmailVerificationTo(activationCode, newEmail, userEntity.getUsername());
        userEntity.setActivationCode(activationCode);
        userRepository.save(userEntity);
        return UserModel.toModel(userEntity);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public UserModel changeEmailVerification(String encryptedCode, String password) throws NoUserFoundException, ValidationException, InvalidPasswordException {
        Optional<UserEntity> optional = userRepository.findByActivationCode(encryptedCode);
        if (optional.isEmpty()) throw new NoUserFoundException("Invalid code.");

        String newEmail = uuidCryptor.hexDecryption(encryptedCode);
        UserValidator.isValidEmail(newEmail);

        UserEntity userEntity = optional.get();
        if (!passwordEncoder.matches(password, userEntity.getPassword()))
            throw new InvalidPasswordException("Invalid password.");

        userEntity.setEmail(newEmail);
        userEntity.setActivationCode(null);

        return UserModel.toModel(userRepository.save(userEntity));
    }

    @Transactional(readOnly = true)
    public EmailModel getEmailByCode(String encryptedCode) throws NoUserFoundException {
        Optional<UserEntity> optional = userRepository.findByActivationCode(encryptedCode);
        if (optional.isEmpty()) throw new NoUserFoundException("Invalid code");
        String decryptedEmail = uuidCryptor.hexDecryption(encryptedCode);

        return new EmailModel(decryptedEmail);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public UserModel deleteAccountByUserId(long userId, String password) throws NoUserFoundException, InvalidPasswordException {
        Optional<UserEntity> optional = userRepository.findById(userId);
        if(optional.isEmpty()) throw new NoUserFoundException("User not found.");
        UserEntity userEntity = optional.get();

        if(!passwordEncoder.matches(password, userEntity.getPassword()))
            throw new InvalidPasswordException("Invalid password");

        userRepository.delete(userEntity);

        fileService.deleteUserFolder(userId);

        return UserModel.toModel(userEntity);
    }
}
