package com.kirillbalabanov.meditationanywhere.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailSenderService {

    private final JavaMailSender javaMailSender;

    private final String serverIp;
    private final String email;

    @Autowired
    public EmailSenderService(JavaMailSender javaMailSender, @Value("${server.address}") String serverIp,
                              @Value("${spring.mail.username}") String email) {
        this.javaMailSender = javaMailSender;
        this.serverIp = serverIp;
        this.email = email;
    }

    /**
     * Send verification email with http://serverip/activate/uuid link.
     * @param userUsername username of registered user.
     * @param userEmail email of registered user.
     * @return true if email has been sent
     */
    public boolean sendVerificationEmailUuidTo(String userUuid, String userUsername, String userEmail) {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        StringBuilder builder = new StringBuilder();
        builder.append("Hello ").append(userUsername).append("!");
        builder.append("\nWelcome to MeditationAnyWhere.");
        builder.append("\nPlease go to ").append(serverIp).append("/activate/").append(userUuid).append(" to verify your account.");
        simpleMailMessage.setTo(userEmail);
        simpleMailMessage.setText(builder.toString());
        simpleMailMessage.setSubject("MeditationAnyWhere verification.");
        simpleMailMessage.setFrom(email);
        javaMailSender.send(simpleMailMessage);
        return true;
    }

}
