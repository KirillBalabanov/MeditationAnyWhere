package com.kirillbalabanov.meditationanywhere.service;

import com.kirillbalabanov.meditationanywhere.creator.UserEntityCreator;
import com.kirillbalabanov.meditationanywhere.entity.StatsEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.exception.auth.InvalidPasswordException;
import com.kirillbalabanov.meditationanywhere.exception.auth.UserNotVerifiedException;
import com.kirillbalabanov.meditationanywhere.exception.user.EmailRegisteredException;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.exception.user.UsernameRegisteredException;
import com.kirillbalabanov.meditationanywhere.exception.validation.ValidationException;
import com.kirillbalabanov.meditationanywhere.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.sql.Date;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserServiceTest {

    @MockBean
    private PasswordEncoder passwordEncoder;
    @MockBean
    private UserRepository userRepository;
    @MockBean
    private EmailSenderService emailSenderService;

    @MockBean
    private FileService fileService;
    @MockBean
    private UUIDCryptor uuidCryptor;
    @Autowired
    private UserService userService;

    @Test
    void register_UsernameTaken_ShouldThrowException() {
        String requestUsername = "username";
        String requestEmail = "email@gmail.ua";
        String requestPassword = "password";

        // userRepository returns already registered user
        Mockito.doReturn(Optional.of(new UserEntity())).when(userRepository).findByUsername(requestUsername);

        assertThrows(UsernameRegisteredException.class, () -> userService.register(requestUsername, requestEmail, requestPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(ArgumentMatchers.anyString());
    }

    @Test
    void register_EmailRegistered_ShouldThrowException() {
        String requestUsername = "username";
        String requestEmail = "email@gmail.ua";
        String requestPassword = "password";

        // userRepository returns already registered user with email 'email'
        Mockito.doReturn(Optional.of(new UserEntity())).when(userRepository).findByEmail(requestEmail);

        assertThrows(EmailRegisteredException.class, () -> userService.register(requestUsername, requestEmail, requestPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findByEmail(ArgumentMatchers.anyString());
    }

    @Test
    void register_SuccessRegistration() throws ValidationException, EmailRegisteredException, UsernameRegisteredException {
        String requestUsername = "username";
        String requestEmail = "email@gmail.ua";
        String requestPassword = "password";

        String encodedPassword = "encodedPassword";

        String activationCode = "activationCode";

        UserEntity registeredUserEntity = UserEntity.initUserEntity(requestUsername, encodedPassword, activationCode, requestEmail, "ROLE_USER");
        registeredUserEntity.setId(1);

        Mockito.doReturn(activationCode).when(uuidCryptor).hexEncryption(requestUsername);
        Mockito.doReturn(Optional.empty()).when(userRepository).findByUsername(requestUsername);
        Mockito.doReturn(Optional.empty()).when(userRepository).findByEmail(requestEmail);
        Mockito.doReturn(registeredUserEntity).when(userRepository).save(ArgumentMatchers.any(UserEntity.class));
        Mockito.doReturn(encodedPassword).when(passwordEncoder).encode(requestPassword);

        assertEquals(registeredUserEntity, userService.register(requestUsername, requestEmail, requestPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(ArgumentMatchers.any());
        Mockito.verify(userRepository, Mockito.times(1)).findByEmail(ArgumentMatchers.any());
        Mockito.verify(userRepository, Mockito.times(1)).save(ArgumentMatchers.any(UserEntity.class));
        Mockito.verify(passwordEncoder, Mockito.times(1)).encode(requestPassword);
        Mockito.verify(uuidCryptor, Mockito.times(1)).hexEncryption(requestUsername);
        Mockito.verify(emailSenderService, Mockito.times(1))
                .sendVerificationEmail(activationCode, requestEmail, requestUsername);
    }

    @Test
    void findByUsername_UserNotFound() {
        String requestUsername = "username";

        Mockito.doReturn(Optional.empty()).when(userRepository).findByUsername(requestUsername);

        assertThrows(NoUserFoundException.class, () -> userService.findByUsername(requestUsername));

        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(ArgumentMatchers.anyString());
    }

    @Test
    void findByUsername_UserFound() throws NoUserFoundException {
        String requestUsername = "username";

        UserEntity foundedUser = new UserEntity();

        Mockito.doReturn(Optional.of(foundedUser)).when(userRepository).findByUsername(requestUsername);

        assertEquals(foundedUser, userService.findByUsername(requestUsername));

        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(ArgumentMatchers.anyString());
    }

    @Test
    void isAbleToLogIn_Able() throws UserNotVerifiedException, ValidationException, NoUserFoundException, InvalidPasswordException {
        String requestUsername = "username";
        String requestEmail = "email@gmail.ua";
        String requestPassword = "password";
        String encodedPassword = "encodedPassword";

        UserEntity verifiedUserEntity = UserEntityCreator.create(1L, requestUsername, encodedPassword, requestEmail,
                true, null, StatsEntity.initStatsEntity(), "ROLE_USER", new Date(new java.util.Date().getTime()));

        Mockito.doReturn(Optional.of(verifiedUserEntity)).when(userRepository).findByUsername(requestUsername);
        Mockito.doReturn(true).when(passwordEncoder).matches(requestPassword, encodedPassword);

        assertEquals(verifiedUserEntity, userService.isAbleToLogIn(requestUsername, requestPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(requestUsername);
        Mockito.verify(passwordEncoder, Mockito.times(1)).matches(requestPassword, encodedPassword);
    }

    @Test
    void isAbleToLogIn_IsNotAble_InvalidPassword() {
        String requestUsername = "username";
        String requestEmail = "email@gmail.ua";
        String requestPassword = "password";
        String encodedPassword = "encodedPassword";

        UserEntity verifiedUserEntity = UserEntityCreator.create(1L, requestUsername, encodedPassword, requestEmail,
                true, null, StatsEntity.initStatsEntity(), "ROLE_USER", new Date(new java.util.Date().getTime()));

        Mockito.doReturn(Optional.of(verifiedUserEntity)).when(userRepository).findByUsername(requestUsername);
        Mockito.doReturn(false).when(passwordEncoder).matches(requestPassword, encodedPassword);

        assertThrows(InvalidPasswordException.class, () -> userService.isAbleToLogIn(requestUsername, requestPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(requestUsername);
        Mockito.verify(passwordEncoder, Mockito.times(1)).matches(requestPassword, encodedPassword);
    }

    @Test
    void isAbleToLogIn_IsNotAble_AccountNotActivated() {
        String requestUsername = "username";
        String requestEmail = "email@gmail.ua";
        String requestPassword = "password";
        String encodedPassword = "encodedPassword";

        UserEntity unVerifiedUserEntity = UserEntityCreator.create(1L, requestUsername, encodedPassword, requestEmail,
                false, "Some Code", StatsEntity.initStatsEntity(), "ROLE_USER", new Date(new java.util.Date().getTime()));

        Mockito.doReturn(Optional.of(unVerifiedUserEntity)).when(userRepository).findByUsername(requestUsername);
        Mockito.doReturn(true).when(passwordEncoder).matches(requestPassword, encodedPassword);

        assertThrows(UserNotVerifiedException.class, () -> userService.isAbleToLogIn(requestUsername, requestPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(requestUsername);
        Mockito.verify(passwordEncoder, Mockito.times(1)).matches(requestPassword, encodedPassword);
    }

    @Test
    void verifyUser_NoUserFoundException() {
        String requestActivationCode = "someCode";

        Mockito.doReturn(Optional.empty()).when(userRepository).findByActivationCode(requestActivationCode);

        assertThrows(NoUserFoundException.class, () -> userService.verifyUserByActivationCode(requestActivationCode));

        Mockito.verify(userRepository, Mockito.times(1)).findByActivationCode(requestActivationCode);
    }

    @Test
    void verifyUser_SuccessVerification() {
        String requestUsername = "username";
        String requestEmail = "email@gmail.ua";
        String encodedPassword = "encodedPassword";

        String verificationCode = "SomeCode";

        UserEntity unVerifiedUserEntity = UserEntityCreator.create(1L, requestUsername, encodedPassword, requestEmail,
                false, verificationCode, StatsEntity.initStatsEntity(), "ROLE_USER", new Date(new java.util.Date().getTime()));

        Mockito.doReturn(Optional.of(unVerifiedUserEntity)).when(userRepository).findByActivationCode(verificationCode);

        assertDoesNotThrow(() -> userService.verifyUserByActivationCode(verificationCode));

        Mockito.verify(userRepository, Mockito.times(1)).findByActivationCode(verificationCode);
    }

    // change username tests
    @Test
    void changeUsername_successChange() throws ValidationException, NoUserFoundException, InvalidPasswordException, UsernameRegisteredException {
        long requestArgId = 1;
        String requestArgNewUsername = "some valid username";
        String requestArgRawPassword = "password";
        String encodedPassword = "encoded";

        UserEntity userEntity = UserEntityCreator.create(requestArgId, "old username", encodedPassword, "someEmail",
                true, null, StatsEntity.initStatsEntity(), "ROLE_USER", new Date(new java.util.Date().getTime()));

        UserEntity userEntityChangedUsername = UserEntityCreator.create(requestArgId, requestArgNewUsername, encodedPassword, "someEmail",
                true, null, StatsEntity.initStatsEntity(), "ROLE_USER", new Date(new java.util.Date().getTime()));

        Mockito.doReturn(Optional.of(userEntity)).when(userRepository).findById(requestArgId);

        Mockito.doReturn(true).when(passwordEncoder).matches(requestArgRawPassword, encodedPassword);

        Mockito.doReturn(Optional.empty()).when(userRepository).findByUsername(requestArgNewUsername);

        Mockito.doReturn(userEntityChangedUsername).when(userRepository).save(userEntity);

        assertEquals(requestArgNewUsername, userService.changeUsername(requestArgId, requestArgNewUsername, requestArgRawPassword).getUsername());

        Mockito.verify(userRepository, Mockito.times(1)).findById(requestArgId);
        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(requestArgNewUsername);
        Mockito.verify(passwordEncoder, Mockito.times(1)).matches(requestArgRawPassword, encodedPassword);
        Mockito.verify(userRepository, Mockito.times(1)).save(ArgumentMatchers.any(UserEntity.class));
    }

    @Test
    void changeUsername_invalidUsername() {
        long requestArgId = 1;
        String requestArgNewUsername = "some @@##@# invalid username";
        String requestArgRawPassword = "password";

        assertThrows(ValidationException.class, () -> userService.changeUsername(requestArgId, requestArgNewUsername, requestArgRawPassword));
    }

    @Test
    void changeUsername_usernameTaken() {
        long requestArgId = 1;
        String requestArgNewUsername = "some valid username";
        String requestArgRawPassword = "password";
        String encodedPassword = "encoded";

        UserEntity userEntity = UserEntityCreator.create(requestArgId, "old username", encodedPassword, "someEmail",
                true, null, StatsEntity.initStatsEntity(), "ROLE_USER", new Date(new java.util.Date().getTime()));


        Mockito.doReturn(Optional.of(userEntity)).when(userRepository).findById(requestArgId);

        Mockito.doReturn(true).when(passwordEncoder).matches(requestArgRawPassword, encodedPassword);

        Mockito.doReturn(Optional.of(new UserEntity())).when(userRepository).findByUsername(requestArgNewUsername);

        assertThrows(UsernameRegisteredException.class, () -> userService.changeUsername(requestArgId, requestArgNewUsername, requestArgRawPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findById(requestArgId);
        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(requestArgNewUsername);
        Mockito.verify(passwordEncoder, Mockito.times(1)).matches(requestArgRawPassword, encodedPassword);
    }

    @Test
    void changeUsername_passwordDoesNotMatch() {
        long requestArgId = 1;
        String requestArgNewUsername = "some valid username";
        String requestArgRawPassword = "password";
        String encodedPassword = "encoded";

        UserEntity userEntity = UserEntityCreator.create(requestArgId, "old username", encodedPassword, "someEmail",
                true, null, StatsEntity.initStatsEntity(), "ROLE_USER", new Date(new java.util.Date().getTime()));

        Mockito.doReturn(Optional.of(userEntity)).when(userRepository).findById(requestArgId);

        Mockito.doReturn(false).when(passwordEncoder).matches(requestArgRawPassword, encodedPassword);

        assertThrows(InvalidPasswordException.class, () -> userService.changeUsername(requestArgId, requestArgNewUsername, requestArgRawPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findById(requestArgId);
    }

    @Test
    void changeUsername_noUserFound() {
        long requestArgId = 1;
        String requestArgNewUsername = "some valid username";
        String requestArgRawPassword = "password";

        Mockito.doReturn(Optional.empty()).when(userRepository).findById(requestArgId);

        assertThrows(NoUserFoundException.class, () -> userService.changeUsername(requestArgId, requestArgNewUsername, requestArgRawPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findById(requestArgId);
    }

    // change email request tests
    @Test
    void changeEmailRequest_successRequest() throws EmailRegisteredException, ValidationException, NoUserFoundException, InvalidPasswordException {
        long requestArgId = 1;
        String requestArgNewEmail = "validemail@gm.ua";
        String requestArgRawPassword = "password";
        String encodedPassword = "encoded";

        String activationCode = "encryptedEmail";

        UserEntity userEntity = UserEntityCreator.create(requestArgId, "some username", encodedPassword, "someEmail",
                true, null, StatsEntity.initStatsEntity(), "ROLE_USER", new Date(new java.util.Date().getTime()));

        Mockito.doReturn(Optional.empty()).when(userRepository).findByEmail(requestArgNewEmail);
        Mockito.doReturn(Optional.of(userEntity)).when(userRepository).findById(requestArgId);
        Mockito.doReturn(true).when(passwordEncoder).matches(requestArgRawPassword, encodedPassword);
        Mockito.doReturn(Optional.empty()).when(userRepository).findByEmail(requestArgNewEmail);
        Mockito.doReturn(activationCode).when(uuidCryptor).hexEncryption(requestArgNewEmail);

        assertEquals(activationCode, userService.changeEmailRequest(requestArgId, requestArgNewEmail, requestArgRawPassword).getActivationCode());

        Mockito.verify(userRepository, Mockito.times(1)).findByEmail(requestArgNewEmail);
        Mockito.verify(userRepository, Mockito.times(1)).findById(requestArgId);
        Mockito.verify(passwordEncoder, Mockito.times(1)).matches(requestArgRawPassword, encodedPassword);
        Mockito.verify(uuidCryptor, Mockito.times(1)).hexEncryption(requestArgNewEmail);
        Mockito.verify(emailSenderService, Mockito.times(1)).sendChangeEmailVerificationTo(activationCode, requestArgNewEmail, userEntity.getUsername());
        Mockito.verify(userRepository, Mockito.times(1)).save(ArgumentMatchers.any(UserEntity.class));
    }

    @Test
    void changeEmailRequest_InvalidEmailThrown() {
        long requestArgId = 1;
        String requestArgNewEmail = "invalid email";
        String requestArgRawPassword = "password";

        assertThrows(ValidationException.class, () -> userService.changeEmailRequest(requestArgId, requestArgNewEmail, requestArgRawPassword));
    }

    @Test
    void changeEmailRequest_EmailExistsThrown() {
        long requestArgId = 1;
        String requestArgNewEmail = "validemail@gm.ua";
        String requestArgRawPassword = "password";

        Mockito.doReturn(Optional.of(new UserEntity())).when(userRepository).findByEmail(requestArgNewEmail);

        assertThrows(EmailRegisteredException.class, () -> userService.changeEmailRequest(requestArgId, requestArgNewEmail, requestArgRawPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findByEmail(requestArgNewEmail);
    }

    @Test
    void changeEmailRequest_SessionUserNotFound() {
        long requestArgId = 1;
        String requestArgNewEmail = "validemail@gm.ua";
        String requestArgRawPassword = "password";

        Mockito.doReturn(Optional.empty()).when(userRepository).findByEmail(requestArgNewEmail);
        Mockito.doReturn(Optional.empty()).when(userRepository).findById(requestArgId);

        assertThrows(NoUserFoundException.class, () -> userService.changeEmailRequest(requestArgId, requestArgNewEmail, requestArgRawPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findByEmail(requestArgNewEmail);
        Mockito.verify(userRepository, Mockito.times(1)).findById(requestArgId);
    }

    @Test
    void changeEmailRequest_InvalidPasswordThrown() {
        long requestArgId = 1;
        String requestArgNewEmail = "validemail@gm.ua";
        String requestArgRawPassword = "password";
        String encodedPassword = "encoded";


        UserEntity userEntity = UserEntityCreator.create(requestArgId, "some username", encodedPassword, "someEmail",
                true, null, StatsEntity.initStatsEntity(), "ROLE_USER", new Date(new java.util.Date().getTime()));

        Mockito.doReturn(Optional.empty()).when(userRepository).findByEmail(requestArgNewEmail);
        Mockito.doReturn(Optional.of(userEntity)).when(userRepository).findById(requestArgId);
        Mockito.doReturn(false).when(passwordEncoder).matches(requestArgRawPassword, encodedPassword);

        assertThrows(InvalidPasswordException.class, () -> userService.changeEmailRequest(requestArgId, requestArgNewEmail, requestArgRawPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findByEmail(requestArgNewEmail);
        Mockito.verify(userRepository, Mockito.times(1)).findById(requestArgId);
        Mockito.verify(passwordEncoder, Mockito.times(1)).matches(requestArgRawPassword, encodedPassword);
    }

    // changeEmailVerification test
    @Test
    void changeEmailVerification_SuccessChange() throws ValidationException, NoUserFoundException, InvalidPasswordException {
        String encryptedCode_Email = "some code";
        String rawPassword = "password";

        String email = "email@gm.ua";
        String encryptedPassword = "encrypted";


        UserEntity userEntity = UserEntityCreator.create(1L, "some username", encryptedPassword, "oldEmail@gm.ua",
                true, encryptedCode_Email, StatsEntity.initStatsEntity(), "ROLE_USER", new Date(new java.util.Date().getTime()));


        UserEntity userEntityChanged = UserEntityCreator.create(1L, "some username", encryptedPassword, email,
                true, null, StatsEntity.initStatsEntity(), "ROLE_USER", new Date(new java.util.Date().getTime()));

        Mockito.doReturn(Optional.of(userEntity)).when(userRepository).findByActivationCode(encryptedCode_Email);
        Mockito.doReturn(email).when(uuidCryptor).hexDecryption(encryptedCode_Email);
        Mockito.doReturn(true).when(passwordEncoder).matches(rawPassword, encryptedPassword);
        Mockito.doReturn(userEntityChanged).when(userRepository).save(userEntity);

        assertEquals(email, userService.changeEmailVerification(encryptedCode_Email, rawPassword).getEmail());

        Mockito.verify(userRepository, Mockito.times(1)).findByActivationCode(encryptedCode_Email);
        Mockito.verify(uuidCryptor, Mockito.times(1)).hexDecryption(encryptedCode_Email);
        Mockito.verify(passwordEncoder, Mockito.times(1)).matches(rawPassword, encryptedPassword);
        Mockito.verify(userRepository, Mockito.times(1)).save(userEntity);

    }

    @Test
    void changeEmailVerification_InvalidCodeThrown() {
        String encryptedCode_Email = "some code";
        String rawPassword = "password";

        Mockito.doReturn(Optional.empty()).when(userRepository).findByActivationCode(encryptedCode_Email);

        assertThrows(NoUserFoundException.class, () -> userService.changeEmailVerification(encryptedCode_Email, rawPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findByActivationCode(encryptedCode_Email);
    }

    @Test
    void changeEmailVerification_InvalidDecryptedEmailThrown() {
        String encryptedCode_Email = "some code";
        String rawPassword = "password";

        String email = "invalid email";
        String encryptedPassword = "encrypted";


        UserEntity userEntity = UserEntityCreator.create(1L, "some username", encryptedPassword, "oldEmail@gm.ua",
                true, encryptedCode_Email, StatsEntity.initStatsEntity(), "ROLE_USER", new Date(new java.util.Date().getTime()));


        Mockito.doReturn(Optional.of(userEntity)).when(userRepository).findByActivationCode(encryptedCode_Email);
        Mockito.doReturn(email).when(uuidCryptor).hexDecryption(encryptedCode_Email);

        assertThrows(ValidationException.class, () -> userService.changeEmailVerification(encryptedCode_Email, rawPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findByActivationCode(encryptedCode_Email);
        Mockito.verify(uuidCryptor, Mockito.times(1)).hexDecryption(encryptedCode_Email);

    }

    @Test
    void changeEmailVerification_InvalidPasswordThrown() {
        String encryptedCode_Email = "some code";
        String rawPassword = "password";

        String email = "email@gm.ua";
        String encryptedPassword = "encrypted";


        UserEntity userEntity = UserEntityCreator.create(1L, "some username", encryptedPassword, "oldEmail@gm.ua",
                true, encryptedCode_Email, StatsEntity.initStatsEntity(), "ROLE_USER", new Date(new java.util.Date().getTime()));

        Mockito.doReturn(Optional.of(userEntity)).when(userRepository).findByActivationCode(encryptedCode_Email);
        Mockito.doReturn(email).when(uuidCryptor).hexDecryption(encryptedCode_Email);
        Mockito.doReturn(false).when(passwordEncoder).matches(rawPassword, encryptedPassword);

        assertThrows(InvalidPasswordException.class, () -> userService.changeEmailVerification(encryptedCode_Email, rawPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findByActivationCode(encryptedCode_Email);
        Mockito.verify(uuidCryptor, Mockito.times(1)).hexDecryption(encryptedCode_Email);
        Mockito.verify(passwordEncoder, Mockito.times(1)).matches(rawPassword, encryptedPassword);
    }

    // delete account test
    @Test
    void deleteUserAccount_SuccessDelete() throws NoUserFoundException, InvalidPasswordException {
        long userId = 1L;

        String requestPassword = "password";

        String encryptedPassword = "encrypted pass";

        UserEntity userEntity = UserEntityCreator.create(userId, "some username", encryptedPassword, "oldEmail@gm.ua",
                true, null, StatsEntity.initStatsEntity(), "ROLE_USER", new Date(new java.util.Date().getTime()));

        Mockito.doReturn(Optional.of(userEntity)).when(userRepository).findById(userId);
        Mockito.doReturn(true).when(passwordEncoder).matches(requestPassword, encryptedPassword);
        Mockito.doNothing().when(fileService).deleteUserFolder(userId);
        Mockito.doNothing().when(userRepository).delete(userEntity);

        assertEquals(userEntity, userService.deleteUserAccount(userId, requestPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findById(userId);
        Mockito.verify(passwordEncoder, Mockito.times(1)).matches(requestPassword, encryptedPassword);
        Mockito.verify(fileService, Mockito.times(1)).deleteUserFolder(userId);
        Mockito.verify(userRepository, Mockito.times(1)).delete(userEntity);
    }

    @Test
    void deleteUserAccount_UserNotFoundThrown() {
        long userId = 1L;

        String requestPassword = "password";

        Mockito.doReturn(Optional.empty()).when(userRepository).findById(userId);

        assertThrows(NoUserFoundException.class, () -> userService.deleteUserAccount(userId, requestPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findById(userId);
    }

    @Test
    void deleteUserAccount_InvalidPasswordThrown() {
        long userId = 1L;

        String requestPassword = "password";

        String encryptedPassword = "encrypted pass";

        UserEntity userEntity = UserEntityCreator.create(userId, "some username", encryptedPassword, "oldEmail@gm.ua",
                true, null, StatsEntity.initStatsEntity(), "ROLE_USER", new Date(new java.util.Date().getTime()));

        Mockito.doReturn(Optional.of(userEntity)).when(userRepository).findById(userId);
        Mockito.doReturn(false).when(passwordEncoder).matches(requestPassword, encryptedPassword);

        assertThrows(InvalidPasswordException.class, () -> userService.deleteUserAccount(userId, requestPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findById(userId);
        Mockito.verify(passwordEncoder, Mockito.times(1)).matches(requestPassword, encryptedPassword);
    }
}