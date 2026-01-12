package com.pmt.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service pour l'envoi d'e-mails.
 */
@Service
public class EmailService {

    /**
     * L'expéditeur de courrier Java utilisé pour envoyer des e-mails.
     */
    @Autowired
    private JavaMailSender emailSender;

    /**
     * L'adresse e-mail de l'expéditeur, injectée à partir des propriétés de configuration.
     */
    @Value("${spring.mail.from}")
    private String from;

    /**
     * Envoie un simple message électronique.
     *
     * @param to Le destinataire de l'e-mail.
     * @param subject L'objet de l'e-mail.
     * @param text Le corps du texte de l'e-mail.
     */
    public void sendSimpleMessage(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage(); 
        message.setFrom(from);
        message.setTo(to); 
        message.setSubject(subject); 
        message.setText(text);
        emailSender.send(message);
    }
}