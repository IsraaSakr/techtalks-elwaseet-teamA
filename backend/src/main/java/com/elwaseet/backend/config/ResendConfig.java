package com.elwaseet.backend.config;

import com.resend.Resend;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * ResendConfig
 * 
 * Configuration class for initializing the Resend email client.
 * Reads API key from application.properties: resend.api.key
 * 
 * Security Note: Store API key in environment variables or secret managers for production.
 */
@Configuration
public class ResendConfig {

    /**
     * Creates a configured Resend client instance.
     * 
     * @param apiKey the Resend API key from application properties
     * @return configured Resend client ready to send emails
     */
    @Bean
    public Resend resend(@Value("${resend.api.key}") String apiKey) {
        return new Resend(apiKey);
    }
}