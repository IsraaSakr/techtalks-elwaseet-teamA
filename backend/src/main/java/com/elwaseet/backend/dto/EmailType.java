package com.elwaseet.backend.dto;

/*EmailType
 * Enumeration representing the various categories of emails that the system
 * can send. These types are used to determine which template, content, or
 * logic should be applied when constructing and sending an email.
 *
 * Enum Values:
 *
 * - OTP_VERIFICATION:
 * Used for sending a One-Time Password (OTP) to verify user identity.
 *
 * - WELCOME:
 * Used for sending welcome or onboarding emails to new users.
 *
 * - APPLICATION_RECEIVED:
 *Sent when a user submits a job or service application.
 *
 * - PAYMENT_CONFIRMATION:
 * Used for notifying users that their payment has been successfully processed.
 *
 * - JOB_COMPLETED:
 *Sent when a service or job has been successfully completed.
 *
 * This enum allows a consistent structure for referencing email types
 * throughout the system.*/
public enum EmailType {
    OTP_VERIFICATION,
    WELCOME,
    APPLICATION_RECEIVED,
    PAYMENT_CONFIRMATION,
    JOB_COMPLETED
}
