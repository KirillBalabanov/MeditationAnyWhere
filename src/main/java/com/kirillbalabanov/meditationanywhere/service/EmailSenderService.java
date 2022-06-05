package com.kirillbalabanov.meditationanywhere.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailSenderService {

    private final JavaMailSender javaMailSender;
    private final String email;
    private final String serverDns;

    @Autowired
    public EmailSenderService(JavaMailSender javaMailSender,
                              @Value("${spring.mail.username}") String email,
                              @Value("${app.server-dns}") String serverDns) {
        this.javaMailSender = javaMailSender;
        this.email = email;
        this.serverDns = serverDns;
    }

    /**
     * Send verification email.
     * @param userUsername username of registered user.
     * @param userEmail email of registered user.
     */
    public void sendVerificationEmail(String userUuid, String userEmail, String userUsername) {
        StringBuilder builder = new StringBuilder();
        builder.append("Hello ").append(userUsername).append("!");
        builder.append("\nWelcome to MeditationAnyWhere.");
        builder.append("\nPlease go to ").append(serverDns).append("/verification/").append(userUuid).append(" to verify your account.");
        sendEmailTo(userEmail, builder.toString(), "MeditationAnyWhere verification.");
    }


    public void sendChangeEmailVerificationTo(String uuid, String userEmail, String userUsername) {
        StringBuilder builder = new StringBuilder();
        builder.append("Hello ").append(userUsername).append("!");
        builder.append("\nPlease go to ").append(serverDns).append("/change/email/").append(uuid).append(" and authenticate to change your email address!.");
        builder.append("\nIf you do not want to change email just dont go to that link, its is only available for 1 day.");
        sendEmailTo(userEmail, builder.toString(), "MeditationAnyWhere - change Email");
    }

    public void sendEmailTo(String userEmail, String body, String title) {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();

        simpleMailMessage.setTo(userEmail);
        simpleMailMessage.setText(body);
        simpleMailMessage.setSubject(title);
        simpleMailMessage.setFrom(email);
        javaMailSender.send(simpleMailMessage);
    }

}
