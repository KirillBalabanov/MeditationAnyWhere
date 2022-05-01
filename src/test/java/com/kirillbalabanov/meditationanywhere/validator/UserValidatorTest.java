package com.kirillbalabanov.meditationanywhere.validator;

import com.kirillbalabanov.meditationanywhere.exception.user.RegistrationException;
import com.kirillbalabanov.meditationanywhere.util.validator.UserValidator;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest()
class UserValidatorTest {

    @Test
    void isValidUsername() {
        String valid1 = "Kjf._ sfd";
        String valid2 = "Kjf._ sfd";
        String valid3 = "Kjf";
        String valid4 = "jjjjjjjjjjjjjjjjjjjj";
        String valid5 = "Sdfj82139 ...";


        String invalid1 = "134 DFLKJ";
        String invalid2 = "@#@# sdfklj";
        String invalid3 = "Jdfjl 234 @@##@$";
        String invalid4 = "Jd";
        String invalid5 = "jjjjjjjjjjjjjjjjjjjjj";

        assertDoesNotThrow(() -> {
            UserValidator.isValidUsername(valid1);
            UserValidator.isValidUsername(valid2);
            UserValidator.isValidUsername(valid3);
            UserValidator.isValidUsername(valid4);
            UserValidator.isValidUsername(valid5);
        });

        assertThrows(RegistrationException.class, () -> {
            UserValidator.isValidUsername(invalid1);
            UserValidator.isValidUsername(invalid2);
            UserValidator.isValidUsername(invalid3);
            UserValidator.isValidUsername(invalid4);
            UserValidator.isValidUsername(invalid5);
        });

    }

    @Test
    void isValidPassword() {

        String valid1 = "pass1";
        String valid2 = "Kjf._ sfd";
        String valid3 = "Kjf";
        String valid4 = "jjjjjjjjjjjjjjjjjjjj";
        String valid5 = "Sdfj82139 ...";


        String invalid1 = "134 DFLKJ";
        String invalid2 = "@#@# sdfklj";
        String invalid3 = "Jdfjl 234 @@##@$";
        String invalid4 = "Jd";
        String invalid5 = "jjjjjjjjjjjjjjjjjjjjj";

        assertDoesNotThrow(() -> {
            UserValidator.isValidUsername(valid1);
            UserValidator.isValidUsername(valid2);
            UserValidator.isValidUsername(valid3);
            UserValidator.isValidUsername(valid4);
            UserValidator.isValidUsername(valid5);
        });

        assertThrows(RegistrationException.class, () -> {
            UserValidator.isValidUsername(invalid1);
            UserValidator.isValidUsername(invalid2);
            UserValidator.isValidUsername(invalid3);
            UserValidator.isValidUsername(invalid4);
            UserValidator.isValidUsername(invalid5);
        });
    }
}