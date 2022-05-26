package com.kirillbalabanov.meditationanywhere.model;

public class EmailModel {
    private final String email;

    private EmailModel(String email) {
        this.email = email;
    }

    public static EmailModel toModel(String email) {
        return new EmailModel(email);
    }

    public String getEmail() {
        return email;
    }
}