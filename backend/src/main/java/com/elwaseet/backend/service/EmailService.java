package com.elwaseet.backend.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final Resend resend;

    @Value("${resend.from}")
    private String from;

    public String sendTestEmail(String to) {
        CreateEmailOptions request = CreateEmailOptions.builder()
                .from(from)
                .to(to)
                .subject("Hello World")
                .html("<p>Congrats on sending your <strong>first email</strong>!</p>")
                .build();

        try {
            CreateEmailResponse response = resend.emails().send(request);
            return response.getId();
        } catch (ResendException e) {
            log.error("Failed to send test email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send email", e);
        }
    }

    @Async
    public void sendOtpEmail(String to, String otp) {
        String htmlContent = buildOtpEmailHtml(otp);
        
        CreateEmailOptions request = CreateEmailOptions.builder()
                .from(from)
                .to(to)
                .subject("Your Elwaseet Verification Code")
                .html(htmlContent)
                .build();

        try {
            CreateEmailResponse response = resend.emails().send(request);
            log.info("OTP email sent successfully to {} with ID: {}", to, response.getId());
        } catch (ResendException e) {
            log.error("Failed to send OTP email to {}: {}", to, e.getMessage());
            // Don't throw exception - email is best-effort, user can resend
        }
    }

    private String buildOtpEmailHtml(String otp) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
                    .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
                    .otp-code { font-size: 32px; font-weight: bold; color: #4CAF50; text-align: center; 
                                letter-spacing: 5px; margin: 20px 0; padding: 15px; 
                                background-color: white; border-radius: 5px; }
                    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                    .warning { color: #d32f2f; font-size: 14px; margin-top: 15px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Elwaseet</h1>
                        <p>Email Verification</p>
                    </div>
                    <div class="content">
                        <h2>Verify Your Email Address</h2>
                        <p>Thank you for registering with Elwaseet! Please use the verification code below to complete your registration:</p>
                        <div class="otp-code">%s</div>
                        <p><strong>This code will expire in 15 minutes.</strong></p>
                        <div class="warning">
                            ⚠️ If you didn't request this code, please ignore this email.
                        </div>
                    </div>
                    <div class="footer">
                        <p>© 2025 Elwaseet. All rights reserved.</p>
                        <p>This is an automated message, please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(otp);
    }
}