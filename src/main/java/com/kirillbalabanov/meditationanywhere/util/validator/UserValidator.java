package com.kirillbalabanov.meditationanywhere.util.validator;

import com.kirillbalabanov.meditationanywhere.exception.user.RegistrationException;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UserValidator {

    /**
     * Validate username. Throws {@link RegistrationException} with message of invalid part of username.
     */
    public static void isValidUsername(String username) throws RegistrationException {
        if (!Patterns.USERNAME_PATTERN.getPattern().matcher(username).matches()) {
            throw new RegistrationException("Invalid username.");
        }
    }

    public static void isValidPassword(String password) throws RegistrationException {
        if(password.length() < 3) throw new RegistrationException("Invalid password length");
        if (!Patterns.PASSWORD_PATTERN.getPattern().matcher(password).matches()) {
            throw new RegistrationException("Invalid password.");
        }
    }

    public static void isValidEmail(String email) throws RegistrationException {
        if(email.length() > 320) throw new RegistrationException("Invalid email.");
        if (!Patterns.EMAIL_PATTERN.getPattern().matcher(email).matches()) throw new RegistrationException("Invalid email.");
    }

    private static String groupByRegex(Pattern regex, String validationString) {
        StringBuilder invalidSymbols = new StringBuilder();
        Matcher matcher = regex.matcher(validationString);
        while (matcher.find()) {
            invalidSymbols.append("'").append(matcher.group()).append("'").append(" ");
        }
        return invalidSymbols.toString();
    }

    enum Patterns {
        USERNAME_PATTERN("(?=[A-Za-z]{3,})[A-Za-z1-9 ._]{0,19}[A-Za-z1-9._]$"),
        PASSWORD_PATTERN("(?=[A-Za-z]{3,})[A-Za-z1-9 ._]{0,19}[A-Za-z1-9._]$"),
        EMAIL_PATTERN("^\\S+@\\S+\\.\\S+$");

        private final Pattern pattern;

        Patterns(String regex) {
            this.pattern = Pattern.compile(regex);
        }

        public Pattern getPattern() {
            return pattern;
        }
    }


}
