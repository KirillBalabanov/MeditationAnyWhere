package com.kirillbalabanov.meditationanywhere.service;

import com.kirillbalabanov.meditationanywhere.creator.UserEntityCreator;
import com.kirillbalabanov.meditationanywhere.entity.StatsEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.exception.user.LoginException;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.exception.user.ValidationException;
import com.kirillbalabanov.meditationanywhere.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.sql.Date;
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

        assertThrows(ValidationException.class, () -> userService.register(requestUsername, requestEmail, requestPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(ArgumentMatchers.anyString());
    }
    @Test
    void register_EmailRegistered_ShouldThrowException() {
        String requestUsername = "username";
        String requestEmail = "email@gmail.ua";
        String requestPassword = "password";

        // userRepository returns already registered user with email 'email'
        Mockito.doReturn(Optional.of(new UserEntity())).when(userRepository).findByEmail(requestEmail);

        assertThrows(ValidationException.class, () -> userService.register(requestUsername, requestEmail, requestPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findByEmail(ArgumentMatchers.anyString());
    }
    @Test
    void register_SuccessRegistration() throws ValidationException {
        String requestUsername = "username";
        String requestEmail = "email@gmail.ua";
        String requestPassword = "password";
        String encodedPassword = "encodedPassword";

        String activationCode = uuidCryptor.encrypt(requestUsername);

        UserEntity registeredUserEntity = UserEntity.initUserEntity(requestUsername, encodedPassword, activationCode, requestEmail, "ROLE_USER");
        registeredUserEntity.setId(1);

        Mockito.doReturn(Optional.empty()).when(userRepository).findByUsername(requestUsername);
        Mockito.doReturn(Optional.empty()).when(userRepository).findByEmail(requestEmail);
        Mockito.doReturn(registeredUserEntity).when(userRepository).save(ArgumentMatchers.any(UserEntity.class));
        Mockito.doReturn(encodedPassword).when(passwordEncoder).encode(requestPassword);

        assertEquals(registeredUserEntity, userService.register(requestUsername, requestEmail, requestPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(ArgumentMatchers.any());
        Mockito.verify(userRepository, Mockito.times(1)).findByEmail(ArgumentMatchers.any());
        Mockito.verify(userRepository, Mockito.times(1)).save(ArgumentMatchers.any());
        Mockito.verify(passwordEncoder, Mockito.times(1)).encode(ArgumentMatchers.anyString());
        Mockito.verify(uuidCryptor, Mockito.times(1)).encrypt(ArgumentMatchers.anyString());
        Mockito.verify(emailSenderService, Mockito.times(1))
                .sendVerificationEmail(ArgumentMatchers.anyString(), ArgumentMatchers.anyString(), ArgumentMatchers.anyString());
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
    void isAbleToLogIn_Able() {
        String requestUsername = "username";
        String requestEmail = "email@gmail.ua";
        String requestPassword = "password";
        String encodedPassword = "encodedPassword";

        UserEntity verifiedUserEntity = UserEntityCreator.create(1L, requestUsername, encodedPassword, requestEmail,
        true, null, StatsEntity.initStatsEntity(), "ROLE_USER", new Date(new java.util.Date().getTime()));

        Mockito.doReturn(Optional.of(verifiedUserEntity)).when(userRepository).findByUsername(requestUsername);
        Mockito.doReturn(true).when(passwordEncoder).matches(requestPassword, encodedPassword);

        assertDoesNotThrow(() -> userService.isAbleToLogIn(requestUsername, requestPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(ArgumentMatchers.anyString());
        Mockito.verify(passwordEncoder, Mockito.times(1)).matches(ArgumentMatchers.anyString(), ArgumentMatchers.anyString());
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

        assertThrows(LoginException.class, () -> userService.isAbleToLogIn(requestUsername, requestPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(ArgumentMatchers.anyString());
        Mockito.verify(passwordEncoder, Mockito.times(1)).matches(ArgumentMatchers.anyString(), ArgumentMatchers.anyString());
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

        assertThrows(LoginException.class, () -> userService.isAbleToLogIn(requestUsername, requestPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(ArgumentMatchers.anyString());
        Mockito.verify(passwordEncoder, Mockito.times(1)).matches(ArgumentMatchers.anyString(), ArgumentMatchers.anyString());
    }
    @Test
    void verifyUser_NoUserFoundException() {
        String givenActivationCode = "someCode";

        Mockito.doReturn(Optional.empty()).when(userRepository).findByActivationCode(givenActivationCode);

        assertThrows(NoUserFoundException.class, () -> userService.verifyUserByActivationCode(givenActivationCode));

        Mockito.verify(userRepository, Mockito.times(1)).findByActivationCode(ArgumentMatchers.anyString());
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

        Mockito.verify(userRepository, Mockito.times(1)).findByActivationCode(ArgumentMatchers.anyString());
    }


}