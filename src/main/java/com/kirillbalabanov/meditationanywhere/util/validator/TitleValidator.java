package com.kirillbalabanov.meditationanywhere.util.validator;

import java.util.regex.Pattern;

public class TitleValidator {

    public static boolean validateAudioTitle(String title) {
        return Patterns.AUDIO_PATTERN.getPattern().matcher(title).matches();
    }

    enum Patterns {
        AUDIO_PATTERN("[A-Za-z1-9][A-Za-z1-9 ._]{1,18}[a-zA-Z1-9]");

        private Pattern pattern;

        Patterns(String regex) {
            this.pattern = Pattern.compile(regex);
        }

        public Pattern getPattern() {
            return pattern;
        }
    }
}
