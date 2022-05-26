package com.kirillbalabanov.meditationanywhere.util.validator;

import com.kirillbalabanov.meditationanywhere.exception.validation.ValidationException;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class UserValidator {
    static final int EMAIL_MAX_LEN = 320;
    static final int PASSWORD_MIN_LEN = 7;

    /**
     * Validate username. Throws {@link ValidationException} with message of invalid part of username.
     */
    public static void isValidUsername(String username) throws ValidationException {
        if (!Patterns.USERNAME_PATTERN.getPattern().matcher(username).matches()) {
            throw new ValidationException("Invalid username.");
        }
    }

    public static void isValidPassword(String password) throws ValidationException {
        if(password.length() < PASSWORD_MIN_LEN) throw new ValidationException("Invalid password length");
        if (!Patterns.PASSWORD_PATTERN.getPattern().matcher(password).matches()) {
            throw new ValidationException("Invalid password.");
        }
    }

    public static void isValidEmail(String email) throws ValidationException {
        if(email.length() > EMAIL_MAX_LEN) throw new ValidationException("Invalid email.");
        if (!Patterns.EMAIL_PATTERN.getPattern().matcher(email).matches()) throw new ValidationException("Invalid email.");
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
