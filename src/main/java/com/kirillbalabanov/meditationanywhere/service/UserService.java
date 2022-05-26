package com.kirillbalabanov.meditationanywhere.service;

import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.exception.auth.InvalidPasswordException;
import com.kirillbalabanov.meditationanywhere.exception.auth.UserNotVerifiedException;
import com.kirillbalabanov.meditationanywhere.exception.user.EmailRegisteredException;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.exception.user.UsernameRegisteredException;
import com.kirillbalabanov.meditationanywhere.exception.validation.ValidationException;
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
     * Registers current {@link UserEntity} in database, sends verification email to user email.
     * <p>
     *    Encrypts password with provided {@link PasswordEncoder}.
     * </p>
     * <p>
     *     Sets activation code, which is basically encrypted with {@link UUIDCryptor#hexEncryption(String)} user username.
     * </p>
     * @return registered UserEntity.
     * @throws ValidationException if username or email is invalid ( doesn't match regex )
     * @throws UsernameRegisteredException user with this username already exists
     * @throws EmailRegisteredException user with this email already exists
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public UserEntity register(String username, String email, String password) {

        UserValidator.isValidUsername(username);
        UserValidator.isValidEmail(email);
        UserValidator.isValidPassword(password);
        if (userRepository.findByUsername(username).isPresent()) throw new UsernameRegisteredException("Username is taken.");
        if (userRepository.findByEmail(email).isPresent())
            throw new EmailRegisteredException("Email is already registered.");

        String activationCode = uuidCryptor.hexEncryption(username);

        UserEntity newUserEntity = UserEntity.initUserEntity(username, email, activationCode, passwordEncoder.encode(password), "ROLE_USER");

        emailSenderService.sendVerificationEmail(newUserEntity.getActivationCode(), email, username);

        newUserEntity.getStatsEntity().setUserEntity(newUserEntity); // bind stats to user
        newUserEntity.getProfileEntity().setUserEntity(newUserEntity); // bind profile to user

        return userRepository.save(newUserEntity);
    }

    @Transactional(readOnly = true)
    public UserEntity findByUsername(String username) {
        Optional<UserEntity> optional = userRepository.findByUsername(username);
        if (optional.isEmpty()) throw new NoUserFoundException("User " + "'" + username + "'" + " not found.");
        return optional.get();
    }

    /**
     * Defines is user with given credentials is able to login.
     * @param username username
     * @param rawPassword raw password
     * @return {@link UserModel} of user that can log in
     * @throws NoUserFoundException if no user is found in db
     * @throws UserNotVerifiedException if user has not verified account yet
     * @throws ValidationException if either username or rawPassword are invalid ( don't match regex )
     * @throws InvalidPasswordException if password doesn't match one in db
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public UserEntity isAbleToLogIn(String username, String rawPassword) {
        UserValidator.isValidUsername(username);
        UserValidator.isValidPassword(rawPassword);
        Optional<UserEntity> optional = userRepository.findByUsername(username);
        if (optional.isEmpty()) throw new NoUserFoundException("User not found.");
        UserEntity userEntity = optional.get();
        if (!passwordEncoder.matches(rawPassword, userEntity.getPassword()))
            throw new InvalidPasswordException("Invalid password");
        if (!userEntity.isActivated()) throw new UserNotVerifiedException("Account is not verified");
        return userEntity;
    }

    @Transactional(readOnly = true)
    public UserEntity findById(long id) {
        Optional<UserEntity> optional = userRepository.findById(id);
        if (optional.isEmpty()) throw new NoUserFoundException("No user found.");
        return optional.get();
    }

    /**
     * Method is responsible for verifying user account.
     * @param activationCode activationCode
     * @throws NoUserFoundException if no user found with such activation code
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void verifyUserByActivationCode(String activationCode) {
        Optional<UserEntity> optional = userRepository.findByActivationCode(activationCode);
        if (optional.isEmpty()) throw new NoUserFoundException("Invalid activation code.");
        UserEntity userEntity = optional.get();
        userEntity.setActivated(true);
        userEntity.setActivationCode(null);
        userRepository.save(userEntity);
    }

    @Transactional(readOnly = true)
    public UserEntity getPrincipal(long userId) {
        Optional<UserEntity> optional = userRepository.findById(userId);
        if (optional.isEmpty()) throw new NoUserFoundException("No user found");
        return optional.get();
    }

    /**
     * Method is responsible for changing username of already registered user.
     * @param id user id
     * @param newUsername new username
     * @param rawPassword raw password
     * @return {@link UserModel} of user with changed username
     * @throws ValidationException if either username or password are invalid
     * @throws NoUserFoundException if no user with such id is found in db
     * @throws UsernameRegisteredException if requestedUsername is already taken
     * @throws InvalidPasswordException if rawPassword doesn't match one in db
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public UserEntity changeUsername(long id, String newUsername, String rawPassword) {
        UserValidator.isValidUsername(newUsername);
        Optional<UserEntity> optional = userRepository.findById(id);
        if (optional.isEmpty()) throw new NoUserFoundException("No user found.");
        UserEntity userEntity = optional.get();
        if (!passwordEncoder.matches(rawPassword, userEntity.getPassword()))
            throw new InvalidPasswordException("Invalid password.");

        if (userRepository.findByUsername(newUsername).isPresent())
            throw new UsernameRegisteredException("Username is taken.");
        userEntity.setUsername(newUsername);
        return userRepository.save(userEntity);
    }

    /**
     * Method is responsible for setting an activation code with encrypted by {@link UUIDCryptor#hexEncryption(String)}
     * and sending verification email to newEmail person requests.
     * @param userId user id
     * @param newEmail new request email
     * @param rawPassword raw password
     * @return {@link UserModel}
     * @throws ValidationException if new email is invalid
     * @throws NoUserFoundException if no user with such id is found
     * @throws InvalidPasswordException if rawPassword doesn't match one in db
     * @throws EmailRegisteredException if email is already registered
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public UserEntity changeEmailRequest(long userId, String newEmail, String rawPassword) {
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
        return userEntity;
    }

    /**
     * Method is responsible for changing person's email.
     * <p>
     *     method takes code, encrypted by {@link UUIDCryptor#hexEncryption(String)}, decrypts it and gets new user's
     *     that would be set.
     * </p>
     * @param encryptedCode encrypted by {@link UUIDCryptor#hexEncryption(String)} code
     * @param password raw password of a user
     * @return {@link UserModel} with changed email
     * @throws NoUserFoundException if no user with such activation code found.
     * @throws ValidationException if decrypted code ( new email ) is not valid
     * @throws InvalidPasswordException if password doesn't match user with given activation code
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public UserEntity changeEmailVerification(String encryptedCode, String password) {
        Optional<UserEntity> optional = userRepository.findByActivationCode(encryptedCode);
        if (optional.isEmpty()) throw new NoUserFoundException("Invalid code.");

        String newEmail = uuidCryptor.hexDecryption(encryptedCode);
        UserValidator.isValidEmail(newEmail);

        UserEntity userEntity = optional.get();
        if (!passwordEncoder.matches(password, userEntity.getPassword()))
            throw new InvalidPasswordException("Invalid password.");

        userEntity.setEmail(newEmail);
        userEntity.setActivationCode(null);

        return userRepository.save(userEntity);
    }

    @Transactional(readOnly = true)
    public String getEmailByCode(String encryptedCode) {
        Optional<UserEntity> optional = userRepository.findByActivationCode(encryptedCode);
        if (optional.isEmpty()) throw new NoUserFoundException("Invalid code");

        return uuidCryptor.hexDecryption(encryptedCode);
    }

    /**
     * Method is responsible for deleting user account from db.
     * <p>
     *     Also deletes user folder from server
     * </p>
     * @param userId user id
     * @param password raw password
     * @return {@link UserModel} of deleted user
     * @throws NoUserFoundException if no user with given id found
     * @throws InvalidPasswordException if password doen't match one in db
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public UserEntity deleteUserAccount(long userId, String password) {
        Optional<UserEntity> optional = userRepository.findById(userId);
        if(optional.isEmpty()) throw new NoUserFoundException("User not found.");
        UserEntity userEntity = optional.get();

        if(!passwordEncoder.matches(password, userEntity.getPassword()))
            throw new InvalidPasswordException("Invalid password");

        userRepository.delete(userEntity);

        fileService.deleteUserFolder(userId);

        return userEntity;
    }
}
