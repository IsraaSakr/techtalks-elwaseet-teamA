package com.elwaseet.backend.config;

import com.resend.Resend;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/* ResendConfig
 * Configuration class responsible for initializing and exposing a
 * {@link Resend} client bean used for sending emails via the Resend API.
 *
 * This class reads the API key from the application configuration
 * (application.yml / application.properties) using the property:
 *
 * resend.api.key=YOUR_API_KEY
 *
 * Once created, the Resend client is made available as a Spring-managed bean,
 * allowing it to be injected into email services or other components.
 *
 * Example usage:
 *
 *@Autowired
 * rivate Resend resendClient;
 *
 * Security Note:
 * - Ensure the API key is stored securely.
 * - Do not hardcode credentials.
 * - Use environment variables or secret managers for production.*/
@Configuration
public class ResendConfig {

    /* The Resend API key loaded from the application's configuration. */
    @Value("${resend.api.key}")
    private String apiKey;

    /* Creates and configures a Resend client instance using the provided API key.
     *
     * @return a configured {@link Resend} client ready to send emails. */
    @Bean
    public Resend resendClient() {
        return new Resend(apiKey);
    }
}
