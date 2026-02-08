package com.sahayaSetu.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username}")
    private String senderEmail;

    @Async
    public void sendApprovalEmail(String toEmail, String ngoName) {
        if (toEmail == null) {
            System.err.println("Cannot send email: recipient is null");
            return;
        }

        try {     
            SimpleMailMessage message = new SimpleMailMessage();

            // OPTION B: Use the authenticated Gmail address to ensure delivery
            message.setFrom(senderEmail);

            message.setTo(toEmail);
            message.setSubject("NGO Registration Approved - SahayaSetu");

            String body = "Dear " + ngoName + ",\n\n" +
                    "We are pleased to inform you that your NGO registration request has been APPROVED.\n" +
                    "You can now log in to your dashboard and start saving lives.\n\n" +
                    "Login here: http://localhost:5173/login/ngo\n\n" +
                    "Regards,\nSahayaSetu Admin Team";

            message.setText(body);

            // Print simulation specific to dev environment
            System.out.println("========== EMAIL SIMULATION ==========");
            System.out.println("From: SahayaSetu Admin <admin@sahayasetu.in>");
            System.out.println("To: " + toEmail);
            System.out.println("Subject: " + message.getSubject());
            System.out.println("Body: " + body);
            System.out.println("======================================");

            mailSender.send(message);
            System.out.println("Mail Sent successfully to: " + toEmail);

        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
        }
    }
}
