package com.elwaseet.backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/* EmailProperties
 * A configuration class responsible for loading and managing all email-related
 * settings for the application. This includes sender information and template
 * identifiers used by email providers (e.g., resend).
 *
 * The class is mapped to configuration properties with the prefix "email",
 * allowing values to be overridden via application.yml or environment
 * variables.
 *
 * Example configuration in application.yml:
 *
 * email:
 * fromEmail: noreply@elwaseet.com
 * fromName: Elwaseet Platform
 * templateIds:
 * otp: some-template-id
 * welcome: some-template-id
 * application: some-template-id
 *
 * Features:
 * - Default sender email and name.
 * - Built-in fallback template IDs.
 * - Supports overriding via external configuration.*/
@Component
@ConfigurationProperties(prefix = "email")
@Data
public class EmailProperties {

    /* The default email address used as the sender for outgoing emails.*/
    private String fromEmail = "noreply@elwaseet.com";

    /* The display name that appears as the sender for outgoing emails.*/
    private String fromName = "Elwaseet Platform";

    /* A map of email template identifiers where the key represents
     * a template name (e.g., "otp", "welcome") and the value is the
     * corresponding provider template ID.*/
    private Map<String, String> templateIds = new HashMap<>();

    /* Initializes the properties with predefined default template IDs.
     * These values act as fallbacks when external configuration does not
     * provide overrides.*/
    public EmailProperties() {
        templateIds.put("otp", "d-otp-template-id");
        templateIds.put("welcome", "d-welcome-template-id");
        templateIds.put("application", "d-application-template-id");
    }
}
