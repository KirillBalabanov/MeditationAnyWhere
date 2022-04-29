package com.kirillbalabanov.meditationanywhere.validator.util;

import com.kirillbalabanov.meditationanywhere.exception.user.RegistrationException;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UserValidator {

    /**
     * Validate username. Throws {@link RegistrationException} with message of invalid part of username.
     */
    public static void isValidUsername(String username) throws RegistrationException {
        if(username.length() < 3 || username.length() > 20)
            throw new RegistrationException("Username should be in range of 3-20 symbols");
        if(!username.matches("^[A-Za-z]{3,}"))
            throw new RegistrationException("Username should start with 3 normal letters");
        if (username.matches("[^1-9A-Za-z _.]")) {
            throw new RegistrationException(groupByRegex("[^1-9A-Za-z _.]", username) + " - invalid symbols in username");
        }
    }
    public static void isValidPassword(String password) throws RegistrationException{
        if(password.length() < 3 || password.length() > 25)
            throw new RegistrationException("Username should be in range of 3-25 symbols");
        if (password.matches("[^1-9A-Za-z _.]")) {
            throw new RegistrationException(groupByRegex("[^1-9A-Za-z _.]", password) + " - invalid symbols in username");
        }
    }

    public static void isValidEmail(String email) throws RegistrationException{
        if(!email.matches("/^\\S+@\\S+\\.\\S+$/\n")) throw new RegistrationException("Invalid email");
    }

    private static String groupByRegex(String regex, String validationString) {
        StringBuilder invalidSymbols = new StringBuilder();
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(validationString);
        while (matcher.find()) {
            invalidSymbols.append(matcher.group());
        }
        return invalidSymbols.toString();
    }

}
