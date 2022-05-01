package com.kirillbalabanov.meditationanywhere.service;

import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.exception.user.RegistrationException;
import com.kirillbalabanov.meditationanywhere.model.UserModel;
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
    void register_UsernameRegistered_ShouldThrowException() {
        UserEntity registerThisUser =
                new UserEntity("validUsername", "validPassword", "email", "ROLE_USER", false, "JJSX");

        // userRepository returns already registered user
        Mockito.doReturn(Optional.of(new UserEntity())).when(userRepository).findByUsername(registerThisUser.getUsername());

        assertThrows(RegistrationException.class, () -> userService.register(registerThisUser));

        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(ArgumentMatchers.anyString());
    }

    @Test
    void register_EmailRegistered_ShouldThrowException() {
        UserEntity registerThisUser =
                new UserEntity("validUsername", "validPassword", "email", "ROLE_USER", false, "JJSX");

        // userRepository returns already registered user with email 'email'
        Mockito.doReturn(Optional.of(new UserEntity())).when(userRepository).findByEmail(registerThisUser.getEmail());

        assertThrows(RegistrationException.class, () -> userService.register(registerThisUser));

        Mockito.verify(userRepository, Mockito.times(1)).findByEmail(ArgumentMatchers.anyString());
    }

    @Test
    void register_SuccessRegistration() throws RegistrationException {
        UserEntity registerThisUser = new UserEntity("validUsername", "validPassword", "email", "ROLE_USER", false, "JSS");
        UserEntity registeredUser = new UserEntity();

        Mockito.doReturn(Optional.empty()).when(userRepository).findByUsername(registerThisUser.getUsername());
        Mockito.doReturn(Optional.empty()).when(userRepository).findByEmail(registerThisUser.getEmail());
        Mockito.doReturn(registeredUser).when(userRepository).save(registerThisUser);
        Mockito.doReturn("encoded").when(passwordEncoder).encode("validPassword");

        assertEquals(registeredUser, userService.register(registerThisUser));

        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(ArgumentMatchers.any());
        Mockito.verify(userRepository, Mockito.times(1)).findByEmail(ArgumentMatchers.any());
        Mockito.verify(userRepository, Mockito.times(1)).save(ArgumentMatchers.any());
        Mockito.verify(passwordEncoder, Mockito.times(1)).encode(ArgumentMatchers.anyString());
    }

    @Test
    void findByUsername_UserNotFound() {
        UserEntity userEntity =
                new UserEntity("Username", "Password", "Email", "ROLE_USER", false, "SDFKLJ");

        Mockito.doReturn(Optional.empty()).when(userRepository).findByUsername(userEntity.getUsername());

        assertThrows(NoUserFoundException.class, () -> userService.findByUsername(userEntity.getUsername()));

        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(ArgumentMatchers.anyString());
    }

    @Test
    void findByUsername_UserFound() throws NoUserFoundException {
        UserEntity userEntity =
                new UserEntity("Username", "Password", "Email", "ROLE_USER", false, "SDFKLJ");

        Mockito.doReturn(Optional.of(userEntity)).when(userRepository).findByUsername(userEntity.getUsername());

        assertEquals(userEntity, userService.findByUsername(userEntity.getUsername()));

        Mockito.verify(userRepository, Mockito.times(1)).findByUsername(ArgumentMatchers.anyString());
    }
}