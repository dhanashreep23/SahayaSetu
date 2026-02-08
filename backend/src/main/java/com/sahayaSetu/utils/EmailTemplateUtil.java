package com.sahayaSetu.utils;

import org.springframework.core.io.ClassPathResource;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

public class EmailTemplateUtil {

    public static String loadTemplate(String path, Map<String, String> values) {
        try {
            ClassPathResource resource = new ClassPathResource(path);
            try (InputStream inputStream = resource.getInputStream()) {
                byte[] bytes = inputStream.readAllBytes();
                String content = new String(bytes, StandardCharsets.UTF_8);

                for (Map.Entry<String, String> entry : values.entrySet()) {
                    content = content.replace("{{" + entry.getKey() + "}}", entry.getValue());
                }
                return content;
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to load email template: " + path, e);
        }
    }

    public static String loadHtmlTemplate(String filename) {
        try {
            ClassPathResource resource = new ClassPathResource("templates/" + filename);
            try (InputStream inputStream = resource.getInputStream()) {
                byte[] bytes = inputStream.readAllBytes();
                return new String(bytes, StandardCharsets.UTF_8);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to load email template: " + filename, e);
        }
    }

    public static String loadRejectedTemplate(String name) {
        java.util.Map<String, String> values = new java.util.HashMap<>();
        values.put("name", name);
        return loadTemplate("templates/ngo-rejected.html", values);
    }
}
