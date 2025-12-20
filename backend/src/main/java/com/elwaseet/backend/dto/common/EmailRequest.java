package com.elwaseet.backend.dto.common;

import lombok.Data;
import java.util.Map;

/* EmailRequest
 * A data transfer object (DTO) representing the structure of an email request
 * within the application. This DTO provides a unified way to capture all details
 * required for sending an email, regardless of the email provider or format.
 *
 * Supported Features:
 * - Standard email fields (recipient, subject, content)
 * - Templated email support with dynamic variables
 * - Multiple email content types (HTML / plain text)
 * - Email classification via {@link EmailType}
 *
 * Usage Scenarios:
 * - Sending simple text emails
 * - Sending HTML emails
 * - Sending template-based emails with placeholder variables
 *
 * Fields Overview:
 * - toEmail: Recipient email address
 * - toName: Recipient name (used for personalization)
 * - subject: Email subject line
 * - emailType: Enum representing the type/category of email
 * - htmlContent: Optional HTML content
 * - textContent: Optional plain text content
 * - templateId: ID of a provider-specific email template
 * - templateVars: Key-value map for template replacement variables*/
@Data
public class EmailRequest {

    /* The recipient's email address. */
    private String toEmail;

    /* The recipient's display name.*/
    private String toName;

    /* The subject line of the email.*/
    private String subject;

    /* The type/category of the email being sent (e.g., OTP, WELCOME, APPLICATION).*/
    private EmailType emailType;

    /* Optional raw HTML content for the email body. */
    private String htmlContent;

    /*Optional plain text content for the email body.*/
    private String textContent;

    /* The template identifier used by email providers (e.g., SendGrid, Resend).
     * If provided, template-based sending will be used.*/
    private String templateId;

    /*A map of template variables used for dynamic value injection
     * when sending provider-based template emails.*/
    private Map<String, Object> templateVars;
}
