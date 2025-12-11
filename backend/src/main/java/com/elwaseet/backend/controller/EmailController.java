package com.elwaseet.backend.controller;

import com.elwaseet.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/*EmailController
 * REST controller responsible for handling email-related API endpoints.
 * This controller exposes simple HTTP endpoints for triggering various
 * notification emails such as OTP emails, welcome emails, and application
 * confirmation emails.
 *
 * The controller delegates all email-sending logic to {@link NotificationService},
 * ensuring a clean separation between HTTP handling and business logic.
 *
 * Base Path:
 *  /api/email
 *
 * Endpoints:
 * 1. POST /send-otp
 * - Sends an OTP email to a given recipient.
 *
 * 2. POST /welcome
 *- Sends a welcome/onboarding email to a new user.
 *
 * 3. POST /application
 * - Sends an application-received confirmation email.
 *
 * Notes:
 * - All endpoints return a `200 OK` with a simple message upon success.
 * - Any errors during sending should be handled inside NotificationService
 *   and mapped to the appropriate HTTP responses.*/
@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {

    /* The notification service responsible for sending different types of emails. */
    private final NotificationService notificationService;

    /* Sends an OTP (One-Time Password) email to the specified user.
     *
     * @param email the recipient's email address
     * @param otp   the generated OTP code to include in the email
     * @param name  the user's name (used for personalization)
     * @return HTTP 200 response indicating that the OTP was sent*/
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(
            @RequestParam String email,
            @RequestParam String otp,
            @RequestParam String name
    ) {
        notificationService.sendOtpEmail(email, otp, name);
        return ResponseEntity.ok("OTP sent!");
    }

    /* Sends a welcome email to a new user.
     *
     * @param email the recipient's email address
     * @param name  the user's name
     * @return HTTP 200 response indicating that the welcome email was sent*/
    @PostMapping("/welcome")
    public ResponseEntity<?> sendWelcome(
            @RequestParam String email,
            @RequestParam String name
    ) {
        notificationService.sendWelcomeEmail(email, name);
        return ResponseEntity.ok("Welcome email sent!");
    }

    /* Sends an application submission confirmation email.
     *
     * @param email     the applicant's email address
     * @param name      the applicant's name
     * @param appId     the application ID or reference number
     * @param position  the applied position title
     * @return HTTP 200 response indicating that the email was sent*/
    @PostMapping("/application")
    public ResponseEntity<?> sendApplication(
            @RequestParam String email,
            @RequestParam String name,
            @RequestParam String appId,
            @RequestParam String position
    ) {
        notificationService.sendApplicationReceivedEmail(email, name, appId, position);
        return ResponseEntity.ok("Application email sent!");
    }
}
