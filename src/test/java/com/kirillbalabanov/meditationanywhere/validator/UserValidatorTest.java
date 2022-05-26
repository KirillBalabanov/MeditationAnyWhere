package com.kirillbalabanov.meditationanywhere.validator;

import com.kirillbalabanov.meditationanywhere.exception.validation.ValidationException;
import com.kirillbalabanov.meditationanywhere.util.validator.UserValidator;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest()
class UserValidatorTest {

    @Test
    void isValidUsername_Valid() {
        String valid1 = "Kjf._ sfd";
        String valid2 = "Kjf34343";
        String valid3 = "Kjf";
        String valid4 = "jjjjjjjjjjjjjjjjjjjj";
        String valid5 = "Sdfj82139 ...";
        String valid6 = "sdf..... sdlkj3434";

        assertDoesNotThrow(() -> {
            UserValidator.isValidUsername(valid1);
            UserValidator.isValidUsername(valid2);
            UserValidator.isValidUsername(valid3);
            UserValidator.isValidUsername(valid4);
            UserValidator.isValidUsername(valid5);
            UserValidator.isValidUsername(valid6);
        });

    }

    @Test
    void isValidUsername_Invalid() {
        String invalid1 = "134 DFLKJ";
        String invalid2 = "@#@# sdfklj";
        String invalid3 = "Jdfjl 23../4 @@##@$";
        String invalid4 = "Jd";
        String invalid5 = "jjjjjjjjjjjjjjjjjjjjj";
        String invalid6 = "sdf>D>><";

        assertThrows(ValidationException.class, () -> {
            UserValidator.isValidUsername(invalid1);
            UserValidator.isValidUsername(invalid2);
            UserValidator.isValidUsername(invalid3);
            UserValidator.isValidUsername(invalid4);
            UserValidator.isValidUsername(invalid5);
            UserValidator.isValidUsername(invalid6);
        });
    }

    @Test
    void isValidPassword_Valid() {
        String valid1 = "pass1";
        String valid2 = "Kjf._ sfd";
        String valid3 = "Kjf";
        String valid4 = "jjjjjjjjjjjjjjjjjjjj";
        String valid5 = "Sdfj82139 ...";

        assertDoesNotThrow(() -> {
            UserValidator.isValidUsername(valid1);
            UserValidator.isValidUsername(valid2);
            UserValidator.isValidUsername(valid3);
            UserValidator.isValidUsername(valid4);
            UserValidator.isValidUsername(valid5);
        });
    }
    @Test
    void isValidPassword_Invalid() {
        String invalid1 = "134 DFLKJ";
        String invalid2 = "@#@# sdfklj";
        String invalid3 = "Jdfjl 234 @@##@$";
        String invalid4 = "Jd";
        String invalid5 = "jjjjjjjjjjjjjjjjjjjjj";

        assertThrows(ValidationException.class, () -> {
            UserValidator.isValidUsername(invalid1);
            UserValidator.isValidUsername(invalid2);
            UserValidator.isValidUsername(invalid3);
            UserValidator.isValidUsername(invalid4);
            UserValidator.isValidUsername(invalid5);
        });
    }

    @Test
    void isValidEmail_Valid() {
        String invalid1 = "sd@cm.ua";
        String invalid2 = "s@c.c";
        String invalid3 = "j_j_j@j_j.c_____";
        assertThrows(ValidationException.class, () -> {
            UserValidator.isValidUsername(invalid1);
            UserValidator.isValidUsername(invalid2);
            UserValidator.isValidUsername(invalid3);
        });
    }

    @Test
    void isValidEmail_Invalid() {
        String invalid1 = " jf@c.com";
        String invalid2 = "j @m.com";
        String invalid3 = "j@ c.com";
        String invalid4 = "j@c .com";
        assertThrows(ValidationException.class, () -> {
            UserValidator.isValidUsername(invalid1);
            UserValidator.isValidUsername(invalid2);
            UserValidator.isValidUsername(invalid3);
            UserValidator.isValidUsername(invalid4);
        });
    }
}