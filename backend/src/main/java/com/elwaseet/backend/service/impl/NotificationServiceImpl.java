package com.elwaseet.backend.service.impl;

import com.elwaseet.backend.service.NotificationService;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import com.elwaseet.backend.config.EmailProperties;

/* NotificationServiceImpl
 * Implementation of the {@link NotificationService} interface that handles all
 * email-notification functionality using the Resend API.
 *
 * This service prepares HTML-based emails for different business events such as:
 * - OTP verification
 * - Welcome emails
 * - Application received confirmations
 *
 * Key Features:
 * - Uses Resend's official Java SDK for sending emails.
 * - Provides pre-styled HTML templates for different email types.
 * - Executes email sending asynchronously using @Async to avoid blocking requests.
 * - Includes detailed logging for both success and error scenarios.
 *
 * Notes:
 * - All emails are sent using Resend's sandbox/test domain by default:
 *onboarding@resend.dev
 *To use a custom domain, update the "from" address in sendEmail().
 *
 * - HTML templates are embedded using Java text blocks for readability.*/
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    /* Resend API client used to send emails.*/
    private final Resend resendClient;
    private final EmailProperties emailProperties;
    
    /* Sends a verification OTP email with a styled HTML template.
     *
     * @param toEmail  recipient email address
     * @param otpCode  the generated OTP code
     * @param userName the name of the recipient*/
    @Override
    @Async
    public void sendOtpEmail(String toEmail, String otpCode, String userName) {
        String subject = "Your OTP Code";

        String htmlContent = String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>OTP Verification</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .otp-code { background-color: #f4f4f4; padding: 15px; margin: 20px 0;
                                border-radius: 5px; font-size: 24px; font-weight: bold;
                                text-align: center; letter-spacing: 5px; color: #2196F3; }
                    .footer { color: #666; font-size: 12px; margin-top: 20px; }
                    .warning { color: #ff9800; font-size: 14px; margin-top: 10px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Your OTP Code</h1>
                    <p>Hello %s,</p>
                    <p>Your One-Time Password (OTP) code is:</p>
                    <div class="otp-code">%s</div>
                    <p>This code will expire in <strong>10 minutes</strong>.</p>
                    <p class="warning">⚠️ Do NOT share this code with anyone.</p>
                    <hr>
                    <p class="footer">This is an automated message. Please do not reply.</p>
                </div>
            </body>
            </html>
            """, userName, otpCode);

        sendEmail(toEmail, subject, htmlContent, "OTP_VERIFICATION");
    }

    /* Sends a welcome/onboarding email to a new user.
     *
     * @param toEmail  recipient email address
     * @param userName the user's name*/
    @Override
    @Async
    public void sendWelcomeEmail(String toEmail, String userName) {
        String subject = "Welcome to Elwaseet Platform!";

        String htmlContent = String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Welcome</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .highlight { background-color: #f9f9f9; padding: 15px; margin: 20px 0;
                                 border-left: 4px solid #4CAF50; }
                    .btn { background-color: #4CAF50; color: white; padding: 12px 24px;
                           text-decoration: none; border-radius: 5px; display: inline-block; }
                    .footer { color: #666; font-size: 12px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1 style="color: #4CAF50;">Welcome to Elwaseet!</h1>
                    <p>Hello <strong>%s</strong>,</p>
                    <p>Your account has been successfully created.</p>

                    <div class="highlight">
                        <p>To get started:</p>
                        <ul>
                            <li>Complete your profile</li>
                            <li>Explore available services</li>
                            <li>Connect with professionals</li>
                        </ul>
                    </div>

                    <a href="https://elwaseet.com/dashboard" class="btn">Go to Dashboard</a>

                    <hr>
                    <p class="footer">Welcome to the Elwaseet community!</p>
                </div>
            </body>
            </html>
            """, userName);

        sendEmail(toEmail, subject, htmlContent, "WELCOME");
    }

    /* Sends an application confirmation email when a user applies for a job.
     *
     * @param toEmail       recipient email
     * @param applicantName applicant's name
     * @param applicationId unique application reference
     * @param position      applied job role  */
    @Override
    @Async
    public void sendApplicationReceivedEmail(
            String toEmail,
            String applicantName,
            String applicationId,
            String position
    ) {
        String subject = "Application Received: " + position;

        String htmlContent = String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Application Received</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .details { background-color: #f0f8ff; padding: 15px; margin: 20px 0;
                               border-radius: 5px; }
                    .btn { background-color: #2196F3; color: white; padding: 12px 24px;
                           text-decoration: none; border-radius: 5px; display: inline-block; }
                    .footer { color: #666; font-size: 12px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1 style="color: #2196F3;">Application Received</h1>
                    <p>Dear <strong>%s</strong>,</p>
                    <p>Thank you for applying for the <strong>%s</strong> position.</p>

                    <div class="details">
                        <h3>Application Details</h3>
                        <p><strong>Application ID:</strong> %s</p>
                        <p><strong>Position:</strong> %s</p>
                        <p><strong>Status:</strong> Under Review</p>
                    </div>

                    <a href="https://elwaseet.com/applications/%s" class="btn">View Your Application</a>

                    <p>We will get back to you within 5–7 business days.</p>

                    <hr>
                    <p class="footer">This is an automated confirmation email.</p>
                </div>
            </body>
            </html>
            """, applicantName, position, applicationId, position, applicationId);

        sendEmail(toEmail, subject, htmlContent, "APPLICATION_RECEIVED");
    }

    /* Shared method that sends an email using Resend API and logs the results.
     *
     * @param toEmail    recipient email address
     * @param subject    email subject line
     * @param htmlContent full HTML content
     * @param emailType  logical email type for logging*/
    private void sendEmail(String toEmail, String subject, String htmlContent, String emailType) {
        try {
            String fromAddress = emailProperties.getFromName() + " <" + emailProperties.getFromEmail() + ">";
            CreateEmailOptions emailOptions = CreateEmailOptions.builder()
                    .from(fromAddress)
                    .to(toEmail)
                    .subject(subject)
                    .html(htmlContent)
                    .build();

            CreateEmailResponse response = resendClient.emails().send(emailOptions);

            log.info("✅ Email sent to {} (Type: {}). Email ID: {}",
                    toEmail, emailType, response.getId());

        } catch (ResendException ex) {
            log.error("❌ Failed to send email to {}: {}", toEmail, ex.getMessage(), ex);
            throw new RuntimeException("Failed to send email", ex);

        } catch (Exception ex) {
            log.error("❌ Unexpected error sending email to {}: {}", toEmail, ex.getMessage(), ex);
            throw new RuntimeException("Failed to send email", ex);
        }
    }
}
