package com.elwaseet.backend.service;

/*NotificationService
 *
 * Service interface defining the contract for sending various types of
 * email notifications throughout the application. Implementations of this
 * interface are responsible for constructing and dispatching emails using
 * the desired email provider (e.g., Resend, SendGrid).
 *
 * Responsibilities:
 * - Encapsulate all email-sending logic
 * - Normalize parameters for different email types
 * - Provide clear, type-specific methods for high-level usage
 *
 * Methods Overview:
 *
 * 1. sendOtpEmail
 *Sends a One-Time Password (OTP) email to a user for verification.
 *
 * 2. sendWelcomeEmail
 *Sends a welcome or onboarding email to a new user.
 *
 * 3. sendApplicationReceivedEmail
 * a confirmation email when a user submits an application.
 *
 * This interface ensures a clean separation between controllers and
 * email infrastructure, simplifying future enhancements or provider changes.*/
public interface NotificationService {

    /* Sends a verification OTP email to the specified recipient.
     *
     * @param toEmail  the recipient's email address
     * @param otpCode  the one-time password code to include in the email
     * @param userName the name of the user receiving the OTP */
    void sendOtpEmail(String toEmail, String otpCode, String userName);

    /* Sends a welcome/onboarding email to a newly registered user.
     *
     * @param toEmail  the recipient's email address
     * @param userName the user's name to personalize the message*/
    void sendWelcomeEmail(String toEmail, String userName);

    /* Sends an application submission confirmation email.
     *
     * @param toEmail        the recipient's email address
     * @param applicantName  the applicant's name
     * @param applicationId  the unique application reference ID
     * @param position       the position or role the applicant applied for */
    void sendApplicationReceivedEmail(String toEmail, String applicantName, String applicationId, String position);
}
