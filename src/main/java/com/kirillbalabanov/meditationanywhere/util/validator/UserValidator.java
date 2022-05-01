package com.kirillbalabanov.meditationanywhere.util.validator;

import com.kirillbalabanov.meditationanywhere.exception.user.RegistrationException;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UserValidator {

    /**
     * Validate username. Throws {@link RegistrationException} with message of invalid part of username.
     */
    public static void isValidUsername(String username) throws RegistrationException {
        Matcher usernameStartsWithMatcher = Patterns.USERNAME_STARTS_WITH_PATTERN.getPattern().matcher(username);
        Matcher usernameMatcher = Patterns.USERNAME_PATTERN.getPattern().matcher(username);
        if (username.length() < 3 || username.length() > 20)
            throw new RegistrationException("Username should be in range of 3-20 symbols");
        if (!usernameStartsWithMatcher.find())
            throw new RegistrationException("Username should start with 3 normal letters");
        if (!usernameMatcher.matches()) {
            throw new RegistrationException(groupByRegex(Patterns.USERNAME_INVALID_SYMBOLS_PATTERN.getPattern(), username) + " - invalid symbols in username");
        }
    }

    public static void isValidPassword(String password) throws RegistrationException {
        Matcher passwordMatcher = Patterns.PASSWORD_PATTERN.getPattern().matcher(password);
        if (password.length() < 3 || password.length() > 25)
            throw new RegistrationException("Username should be in range of 3-25 symbols");
        if (!passwordMatcher.matches()) {
            throw new RegistrationException(groupByRegex(Patterns.PASSWORD_INVALID_SYMBOLS_PATTERN.getPattern(), password) + " - invalid symbols in username");
        }
    }

    public static void isValidEmail(String email) throws RegistrationException {
        Matcher emailMatcher = Patterns.EMAIL_PATTERN.getPattern().matcher(email);
        if (!emailMatcher.matches()) throw new RegistrationException("Invalid email");
    }

    private static String groupByRegex(Pattern regex, String validationString) {
        StringBuilder invalidSymbols = new StringBuilder();
        Matcher matcher = regex.matcher(validationString);
        while (matcher.find()) {
            invalidSymbols.append(matcher.group());
        }
        return invalidSymbols.toString();
    }

    enum Patterns {
        USERNAME_STARTS_WITH_PATTERN("^[A-Za-z]{3,}"),
        USERNAME_PATTERN("[1-9A-Za-z _.]{3,20}"),
        USERNAME_INVALID_SYMBOLS_PATTERN("[^1-9A-Za-z _.]"),
        PASSWORD_PATTERN("[1-9A-Za-z _.]"),
        PASSWORD_INVALID_SYMBOLS_PATTERN("[^1-9A-Za-z _.]"),
        EMAIL_PATTERN("/^\\S+@\\S+\\.\\S+$/\n");

        private final Pattern pattern;

        Patterns(String regex) {
            this.pattern = Pattern.compile(regex);
        }

        public Pattern getPattern() {
            return pattern;
        }
    }


}
