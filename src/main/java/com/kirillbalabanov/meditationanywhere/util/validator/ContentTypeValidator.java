package com.kirillbalabanov.meditationanywhere.util.validator;

import java.util.regex.Pattern;

public class ContentTypeValidator {

    public static boolean isValidImage(String contentType) {
        return Patterns.IMG_PATTERN.getPattern().matcher(contentType).matches();
    }

    public static boolean isValidAudio(String contentType) {
        return Patterns.AUDIO_PATTERN.getPattern().matcher(contentType).matches();
    }

    enum Patterns {
        IMG_PATTERN("image.*"),
        AUDIO_PATTERN("audio.*");

        private final Pattern pattern;

        Patterns(String regex) {
            this.pattern = Pattern.compile(regex);
        }

        public Pattern getPattern() {
            return pattern;
        }
    }

}

