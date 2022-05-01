package com.kirillbalabanov.meditationanywhere.service;

import com.kirillbalabanov.meditationanywhere.entity.StatsEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.exception.user.LoginException;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.exception.user.RegistrationException;
import com.kirillbalabanov.meditationanywhere.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserServiceTest {

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private UserService userService;


    @Test
    void register_UsernameTaken_ShouldThrowException() {
        UserEntity givenUserEntity =
                new UserEntity("validUsername", "validEmail@gmail.com", "validPassword");

        // userRepository returns already registered user
        Mockito.doReturn(Optional.of(new UserEntity())).when(userRepository).findByUsername(givenUserEntity.getUsername());

        assertThrows(RegistrationException.class, () -> userService.register(givenUserEntity));

        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(ArgumentMatchers.anyString());
    }

    @Test
    void register_EmailRegistered_ShouldThrowException() {
        UserEntity givenUserEntity =
                new UserEntity("validUsername", "validEmail@gmail.com", "validPassword");

        // userRepository returns already registered user with email 'email'
        Mockito.doReturn(Optional.of(new UserEntity())).when(userRepository).findByEmail(givenUserEntity.getEmail());

        assertThrows(RegistrationException.class, () -> userService.register(givenUserEntity));

        Mockito.verify(userRepository, Mockito.times(1)).findByEmail(ArgumentMatchers.anyString());
    }

    @Test
    void register_SuccessRegistration() throws RegistrationException {
        UserEntity givenUserEntity =
                new UserEntity("validUsername", "validEmail@gmail.com", "validPassword");
        UserEntity registeredUser = new UserEntity("validUsername", "validEmail@gmail.com",
                "encodedPassword", "ROLE_USER", false, "SomeCode");
        registeredUser.setStatsEntity(StatsEntity.initStatsEntity());

        Mockito.doReturn(Optional.empty()).when(userRepository).findByUsername(givenUserEntity.getUsername());
        Mockito.doReturn(Optional.empty()).when(userRepository).findByEmail(givenUserEntity.getEmail());
        Mockito.doReturn(registeredUser).when(userRepository).save(givenUserEntity);
        Mockito.doReturn("encodedPassword").when(passwordEncoder).encode("validPassword");

        assertEquals(registeredUser, userService.register(givenUserEntity));

        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(ArgumentMatchers.any());
        Mockito.verify(userRepository, Mockito.times(1)).findByEmail(ArgumentMatchers.any());
        Mockito.verify(userRepository, Mockito.times(1)).save(ArgumentMatchers.any());
        Mockito.verify(passwordEncoder, Mockito.times(1)).encode(ArgumentMatchers.anyString());
    }

    @Test
    void findByUsername_UserNotFound() {
        UserEntity givenUserEntity =
                new UserEntity("Username", "Password", "Email", "ROLE_USER", false, "someCode");

        Mockito.doReturn(Optional.empty()).when(userRepository).findByUsername(givenUserEntity.getUsername());

        assertThrows(NoUserFoundException.class, () -> userService.findByUsername(givenUserEntity.getUsername()));

        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(ArgumentMatchers.anyString());
    }

    @Test
    void findByUsername_UserFound() throws NoUserFoundException {
        UserEntity givenUserEntity =
                new UserEntity("Username", "Password", "Email", "ROLE_USER", false, "someCode");

        Mockito.doReturn(Optional.of(givenUserEntity)).when(userRepository).findByUsername(givenUserEntity.getUsername());

        assertEquals(givenUserEntity, userService.findByUsername(givenUserEntity.getUsername()));

        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(ArgumentMatchers.anyString());
    }

    @Test
    void isAbleToLogIn_Able() {
        String givenUsername = "someUsername";
        String givenPassword = "somePassword";

        UserEntity verifiedUserEntity = new UserEntity(givenUsername, "someEmail@gmail.ua", "encodedPassword");
        verifiedUserEntity.setActivated(true);
        verifiedUserEntity.setActivationCode(null);

        Mockito.doReturn(Optional.of(verifiedUserEntity)).when(userRepository).findByUsername(givenUsername);
        Mockito.doReturn(true).when(passwordEncoder).matches(givenPassword, verifiedUserEntity.getPassword());

        assertDoesNotThrow(() -> userService.isAbleToLogIn(givenUsername, givenPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(ArgumentMatchers.anyString());
        Mockito.verify(passwordEncoder, Mockito.times(1)).matches(ArgumentMatchers.anyString(), ArgumentMatchers.anyString());
    }

    @Test
    void isAbleToLogIn_IsNotAble_InvalidPassword() {
        String givenUsername = "someUsername";
        String givenPassword = "somePassword";

        UserEntity verifiedUserEntity = new UserEntity(givenUsername, "someEmail@gmail.ua", "encodedPassword");
        verifiedUserEntity.setActivated(true);
        verifiedUserEntity.setActivationCode(null);

        Mockito.doReturn(Optional.of(verifiedUserEntity)).when(userRepository).findByUsername(givenUsername);
        Mockito.doReturn(false).when(passwordEncoder).matches(givenPassword, verifiedUserEntity.getPassword());

        assertThrows(LoginException.class, () -> userService.isAbleToLogIn(givenUsername, givenPassword));

        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(ArgumentMatchers.anyString());
        Mockito.verify(passwordEncoder, Mockito.times(1)).matches(ArgumentMatchers.anyString(), ArgumentMatchers.anyString());
    }

    @Test
    void isAbleToLogIn_IsNotAble_AccountNotActivated() {
        String givenUsername = "someUsername";
        String givenPassword = "somePassword";

        UserEntity verifiedUserEntity = new UserEntity(givenUsername, "someEmail@gmail.ua", "encodedPassword");
        verifiedUserEntity.setActivated(false);
        verifiedUserEntity.setActivationCode(null);

        Mockito.doReturn(Optional.of(verifiedUserEntity)).when(userRepository).findByUsername(givenUsername);
        Mockito.doReturn(true).when(passwordEncoder).matches(givenPassword, verifiedUserEntity.getPassword());

        assertThrows(LoginException.class, () -> userService.isAbleToLogIn(givenUsername, givenPassword));

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
        String givenActivationCode = "someCode";
        UserEntity verifiedUserEntity = new UserEntity("someUsername", "somePassword", "someEmail@gmail.ua");
        verifiedUserEntity.setActivationCode(givenActivationCode);
        verifiedUserEntity.setActivated(true);
        verifiedUserEntity.setRole("ROLE_USER");

        Mockito.doReturn(Optional.of(verifiedUserEntity)).when(userRepository).findByActivationCode(givenActivationCode);

        assertDoesNotThrow(() -> userService.verifyUserByActivationCode(givenActivationCode));

        Mockito.verify(userRepository, Mockito.times(1)).findByActivationCode(ArgumentMatchers.anyString());
    }
}