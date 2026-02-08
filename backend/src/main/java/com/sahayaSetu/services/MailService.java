package com.sahayaSetu.services;

import com.sahayaSetu.utils.EmailTemplateUtil;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username}")
    private String senderEmail;

    @Async
    public void sendNgoApprovalMail(String to, String ngoName) {
        String subject = "NGO Registration Approved - SahayaSetu";
        try {
            Map<String, String> values = new HashMap<>();
            values.put("name", ngoName);
            values.put("loginUrl", "http://localhost:5173/login/ngo");

            String html = EmailTemplateUtil.loadTemplate("templates/ngo-approved.html", values);
            sendEmailInternal(to, subject, html);
            System.out.println("Approval email sent successfully to " + to);

        } catch (Exception e) {
            System.err.println("Approval email failed to " + to + ". Reason: " + e.getMessage());
        }
    }

    @Async
    public void sendDisapprovalEmail(String to, String name) {
        String subject = "NGO Registration Disapproved";
        try {
            String htmlBody = EmailTemplateUtil.loadHtmlTemplate("ngo-disapproved.html")
                    .replace("{{name}}", name);

            sendEmailInternal(to, subject, htmlBody);
            System.out.println("Disapproval email sent to " + to);
        } catch (Exception e) {
            System.err.println("Email failed to " + to + ". Reason: " + e.getMessage());
        }
    }

    @Async
    public void sendNgoDisableEmail(String to, String ngoName) {
        String subject = "NGO Account Disabled - SahayaSetu";
        try {
            String body = "Dear " + ngoName + ",\n\n" +
                    "Due to violations of terms and policies or other suspicious activities, your NGO has been blocked.\n" +
                    "Please contact the admin at admin@sahayasetu.in for further updates.\n\n" +
                    "Regards,\nSahayaSetu Admin Team";

            sendEmailInternal(to, subject, body);
            System.out.println("NGO disable email sent to " + to);
        } catch (Exception e) {
            System.err.println("NGO disable email failed to " + to + ". Reason: " + e.getMessage());
        }
    }

    private void sendEmailInternal(String to, String subject, String body) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true);
        helper.setFrom(new InternetAddress("admin@sahayasetu.in", "SahayaSetu Admin"));

        mailSender.send(message);
    }
}
