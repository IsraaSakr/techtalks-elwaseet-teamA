package com.elwaseet.backend.service;

import com.elwaseet.backend.entity.Dispute;
import com.elwaseet.backend.entity.User;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import java.math.BigDecimal;
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

    @Async
    public void sendApplicationNotification(String customerEmail, String jobTitle, String providerName, BigDecimal quote) {
        String htmlContent = buildApplicationNotificationHtml(jobTitle, providerName, quote);
        
        CreateEmailOptions request = CreateEmailOptions.builder()
                .from(from)
                .to(customerEmail)
                .subject("New Application for Your Job: " + jobTitle)
                .html(htmlContent)
                .build();

        try {
            CreateEmailResponse response = resend.emails().send(request);
            log.info("Application notification email sent successfully to {} with ID: {}", customerEmail, response.getId());
        } catch (ResendException e) {
            log.error("Failed to send application notification email to {}: {}", customerEmail, e.getMessage());
            // Don't throw exception - email is best-effort
        }
    }

    private String buildApplicationNotificationHtml(String jobTitle, String providerName, BigDecimal quote) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
                    .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
                    .job-details { background-color: white; padding: 20px; border-radius: 5px; margin: 15px 0; 
                                border-left: 4px solid #2196F3; }
                    .quote { font-size: 24px; font-weight: bold; color: #4CAF50; }
                    .button { background-color: #2196F3; color: white; padding: 12px 24px; 
                            text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
                    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                    .highlight { background-color: #e3f2fd; padding: 10px; border-radius: 5px; margin: 10px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Elwaseet</h1>
                        <p>📋 New Job Application Received</p>
                    </div>
                    <div class="content">
                        <h2>Great news! You have a new application</h2>
                        <div class="job-details">
                            <p><strong>Job Title:</strong> %s</p>
                            <p><strong>Provider:</strong> %s</p>
                            <p><strong>Quoted Price:</strong> <span class="quote">$%s</span></p>
                        </div>
                        <div class="highlight">
                            <p>💡 <strong>Next Steps:</strong></p>
                            <p>• Review the provider's profile and application details</p>
                            <p>• Compare with other applications you may receive</p>
                            <p>• Accept the best provider for your job</p>
                        </div>
                        <p>Click below to view all applications and make your choice:</p>
                        <center>
                            <a href="#" class="button">View All Applications</a>
                        </center>
                    </div>
                    <div class="footer">
                        <p>© 2025 Elwaseet. All rights reserved.</p>
                        <p>This is an automated message, please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(jobTitle, providerName, quote);
    }

    /**
     * Send application acceptance notification to provider
     */
    @Async
    public void sendApplicationAcceptedEmail(String providerEmail, String providerName, String jobTitle) {
        String htmlContent = buildApplicationAcceptedHtml(providerName, jobTitle);
        
        CreateEmailOptions request = CreateEmailOptions.builder()
                .from(from)
                .to(providerEmail)
                .subject("🎉 Your Application Has Been Accepted!")
                .html(htmlContent)
                .build();

        try {
            CreateEmailResponse response = resend.emails().send(request);
            log.info("Application acceptance email sent to {} with ID: {}", providerEmail, response.getId());
        } catch (ResendException e) {
            log.error("Failed to send acceptance email to {}: {}", providerEmail, e.getMessage());
        }
    }

    /**
     * Send application rejection notification to provider
     */
    @Async
    public void sendApplicationRejectedEmail(String providerEmail, String providerName, String jobTitle) {
        String htmlContent = buildApplicationRejectedHtml(providerName, jobTitle);
        
        CreateEmailOptions request = CreateEmailOptions.builder()
                .from(from)
                .to(providerEmail)
                .subject("Application Status Update - " + jobTitle)
                .html(htmlContent)
                .build();

        try {
            CreateEmailResponse response = resend.emails().send(request);
            log.info("Application rejection email sent to {} with ID: {}", providerEmail, response.getId());
        } catch (ResendException e) {
            log.error("Failed to send rejection email to {}: {}", providerEmail, e.getMessage());
        }
    }

    /**
     * Build HTML for acceptance email
     */
    private String buildApplicationAcceptedHtml(String providerName, String jobTitle) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4CAF50; color: white; padding: 30px; text-align: center; border-radius: 5px; }
                    .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
                    .success-badge { background-color: #4CAF50; color: white; padding: 10px 20px; 
                                border-radius: 20px; display: inline-block; margin: 15px 0; }
                    .job-title { background-color: white; padding: 15px; border-radius: 5px; 
                            border-left: 4px solid #4CAF50; margin: 15px 0; }
                    .next-steps { background-color: #e8f5e9; padding: 20px; border-radius: 5px; margin: 20px 0; }
                    .button { background-color: #4CAF50; color: white; padding: 12px 30px; 
                            text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
                    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Congratulations!</h1>
                        <div class="success-badge">Application Accepted</div>
                    </div>
                    <div class="content">
                        <p>Dear <strong>%s</strong>,</p>
                        
                        <p>Great news! Your application has been <strong>accepted</strong> by the customer.</p>
                        
                        <div class="job-title">
                            <h3 style="margin: 0; color: #4CAF50;">Job: %s</h3>
                        </div>
                        
                        <div class="next-steps">
                            <h3 style="color: #2e7d32; margin-top: 0;">📋 Next Steps:</h3>
                            <ol>
                                <li><strong>Contact the customer</strong> to confirm details and schedule</li>
                                <li><strong>Review the job requirements</strong> carefully</li>
                                <li><strong>Complete the work</strong> according to agreed specifications</li>
                                <li><strong>Mark as complete</strong> when finished</li>
                            </ol>
                        </div>
                        
                        <center>
                            <a href="https://elwaseet.com/dashboard/jobs" class="button">View Job Details</a>
                        </center>
                        
                        <p style="margin-top: 20px;">
                            The customer chose you because of your skills and professionalism. 
                            Make sure to deliver excellent service!
                        </p>
                    </div>
                    <div class="footer">
                        <p>© 2025 Elwaseet. All rights reserved.</p>
                        <p>This is an automated message, please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(providerName, jobTitle);
    }

    /**
     * Build HTML for rejection email
     */
    private String buildApplicationRejectedHtml(String providerName, String jobTitle) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #2196F3; color: white; padding: 30px; text-align: center; border-radius: 5px; }
                    .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
                    .job-title { background-color: white; padding: 15px; border-radius: 5px; 
                            border-left: 4px solid #2196F3; margin: 15px 0; }
                    .encouragement { background-color: #e3f2fd; padding: 20px; border-radius: 5px; margin: 20px 0; }
                    .button { background-color: #2196F3; color: white; padding: 12px 30px; 
                            text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
                    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Application Status Update</h1>
                    </div>
                    <div class="content">
                        <p>Dear <strong>%s</strong>,</p>
                        
                        <p>Thank you for your interest and for taking the time to submit your application.</p>
                        
                        <div class="job-title">
                            <h3 style="margin: 0; color: #1976d2;">Job: %s</h3>
                        </div>
                        
                        <p>
                            Unfortunately, the customer has chosen to proceed with another provider for this job. 
                            This decision was based on their specific needs and requirements.
                        </p>
                        
                        <div class="encouragement">
                            <h3 style="color: #1565c0; margin-top: 0;">💡 Keep Going!</h3>
                            <p style="margin: 0;">
                                Don't be discouraged! There are many other opportunities available on Elwaseet. 
                                Keep building your profile, showcase your best work, and the right job will come along.
                            </p>
                        </div>
                        
                        <center>
                            <a href="https://elwaseet.com/browse-jobs" class="button">Browse More Jobs</a>
                        </center>
                        
                        <p style="margin-top: 20px; font-size: 14px; color: #666;">
                            <strong>Tips for success:</strong><br>
                            • Complete your profile with portfolio photos<br>
                            • Respond quickly to new job opportunities<br>
                            • Provide competitive and fair quotes<br>
                            • Build a strong reputation with excellent reviews
                        </p>
                    </div>
                    <div class="footer">
                        <p>© 2025 Elwaseet. All rights reserved.</p>
                        <p>This is an automated message, please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(providerName, jobTitle);
    }

    /**
     * Send job cancellation notification to provider
     */
    @Async
    public void sendJobCancelledNotification(
            String providerEmail, 
            String providerName,
            String jobTitle,
            BigDecimal budgetMin,
            BigDecimal budgetMax,
            String location) {
        
        String htmlContent = buildJobCancelledHtml(
            providerName, jobTitle, budgetMin, budgetMax, location
        );
        
        CreateEmailOptions request = CreateEmailOptions.builder()
                .from(from)
                .to(providerEmail)
                .subject("Job Cancelled - " + jobTitle)
                .html(htmlContent)
                .build();

        try {
            CreateEmailResponse response = resend.emails().send(request);
            log.info("Job cancellation email sent to {} with ID: {}", providerEmail, response.getId());
        } catch (ResendException e) {
            log.error("Failed to send job cancellation email to {}: {}", providerEmail, e.getMessage());
            // Don't throw - notification failure shouldn't break the cancellation
        }
    }

    /**
     * Build HTML for job cancellation email
     */
    private String buildJobCancelledHtml(
        String providerName,
        String jobTitle, 
        BigDecimal budgetMin, 
        BigDecimal budgetMax,
        String location) {
    
    return """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #FF9800; color: white; padding: 30px; text-align: center; border-radius: 5px; }
                .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
                .job-details { background-color: white; padding: 20px; border-radius: 5px; 
                            border-left: 4px solid #FF9800; margin: 15px 0; }
                .encouragement { background-color: #fff3e0; padding: 20px; border-radius: 5px; margin: 20px 0; }
                .button { background-color: #2196F3; color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
                .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Job Cancelled</h1>
                </div>
                <div class="content">
                    <p>Dear <strong>%s</strong>,</p>
                    
                    <p>We wanted to let you know that the following job has been cancelled by the customer:</p>
                    
                    <div class="job-details">
                        <h3 style="margin: 0 0 10px 0; color: #FF9800;">%s</h3>
                        <p style="margin: 5px 0;"><strong>Budget:</strong> $%s - $%s</p>
                        <p style="margin: 5px 0;"><strong>Location:</strong> %s</p>
                        <p style="margin: 5px 0;"><strong>Reason:</strong> Customer cancelled before selecting a provider</p>
                    </div>
                    
                    <p>Your application has been automatically rejected since the job is no longer available.</p>
                    
                    <div class="encouragement">
                        <h3 style="color: #F57C00; margin-top: 0;">💡 Don't Give Up!</h3>
                        <p style="margin: 0;">
                            This happens from time to time, and it's not a reflection of your skills or qualifications. 
                            Keep browsing for other jobs on Elwaseet - the right opportunity is waiting for you!
                        </p>
                    </div>
                    
                    <center>
                        <a href="https://elwaseet.com/browse-jobs" class="button">Browse More Jobs</a>
                    </center>
                    
                    <p style="margin-top: 20px; font-size: 14px; color: #666;">
                        <strong>Keep building your success:</strong><br>
                        • Stay active and check for new jobs regularly<br>
                        • Update your portfolio with your best work<br>
                        • Respond quickly to opportunities<br>
                        • Maintain competitive quotes and excellent service
                    </p>
                </div>
                <div class="footer">
                    <p>© 2025 Elwaseet. All rights reserved.</p>
                    <p>This is an automated message, please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
        """.formatted(providerName, jobTitle, budgetMin, budgetMax, location);
}

    /**
     * Send email when dispute is resolved
     * Notifies both customer and provider about the admin's decision
     */
    @Async
    public void sendDisputeResolvedEmail(
            String providerEmail, String providerName,
            String customerEmail, String customerName,
            String jobTitle,
            Dispute.DisputeResolution resolution,
            BigDecimal providerAmount,
            BigDecimal customerAmount,
            String adminNotes) {

        // Email to Provider
        String providerSubject = "Dispute Resolved - " + jobTitle;
        String providerHtml = buildDisputeResolvedProviderEmail(
            providerName, jobTitle, resolution, providerAmount, adminNotes
        );
        
        CreateEmailOptions providerRequest = CreateEmailOptions.builder()
                .from(from)
                .to(providerEmail)
                .subject(providerSubject)
                .html(providerHtml)
                .build();

        try {
            CreateEmailResponse response = resend.emails().send(providerRequest);
            log.info("Dispute resolved email sent to provider {} with ID: {}", providerEmail, response.getId());
        } catch (ResendException e) {
            log.error("Failed to send dispute resolved email to provider {}: {}", providerEmail, e.getMessage());
        }

        // Email to Customer
        String customerSubject = "Dispute Resolved - " + jobTitle;
        String customerHtml = buildDisputeResolvedCustomerEmail(
            customerName, jobTitle, resolution, customerAmount, adminNotes
        );
        
        CreateEmailOptions customerRequest = CreateEmailOptions.builder()
                .from(from)
                .to(customerEmail)
                .subject(customerSubject)
                .html(customerHtml)
                .build();

        try {
            CreateEmailResponse response = resend.emails().send(customerRequest);
            log.info("Dispute resolved email sent to customer {} with ID: {}", customerEmail, response.getId());
        } catch (ResendException e) {
            log.error("Failed to send dispute resolved email to customer {}: {}", customerEmail, e.getMessage());
        }
    }

    /**
     * Send email for FIX_REQUIRED resolution
     */
    @Async
    public void sendDisputeFixRequiredEmail(
            String providerEmail, String providerName,
            String customerEmail, String customerName,
            String jobTitle,
            String adminNotes) {

        // Email to Provider
        String providerHtml = buildFixRequiredProviderEmail(providerName, jobTitle, adminNotes);
        CreateEmailOptions providerRequest = CreateEmailOptions.builder()
                .from(from)
                .to(providerEmail)
                .subject("Action Required: Fix Work - " + jobTitle)
                .html(providerHtml)
                .build();

        try {
            resend.emails().send(providerRequest);
            log.info("Fix required email sent to provider {}", providerEmail);
        } catch (ResendException e) {
            log.error("Failed to send fix required email to provider: {}", e.getMessage());
        }

        // Email to Customer
        String customerHtml = buildFixRequiredCustomerEmail(customerName, jobTitle, adminNotes);
        CreateEmailOptions customerRequest = CreateEmailOptions.builder()
                .from(from)
                .to(customerEmail)
                .subject("Dispute Update: Provider Will Fix Work - " + jobTitle)
                .html(customerHtml)
                .build();

        try {
            resend.emails().send(customerRequest);
            log.info("Fix required email sent to customer {}", customerEmail);
        } catch (ResendException e) {
            log.error("Failed to send fix required email to customer: {}", e.getMessage());
        }
    }

    /**
     * Notify admin when new appeal is submitted
     */
    @Async
    public void sendNewAppealNotificationToAdmin(Dispute dispute, User appealedBy, String appealReason) {
        String adminEmail = "admin@elwaseet.com"; 
        
        String html = buildNewAppealAdminEmail(dispute, appealedBy, appealReason);
        CreateEmailOptions request = CreateEmailOptions.builder()
                .from(from)
                .to(adminEmail)
                .subject("New Dispute Appeal - " + dispute.getJob().getTitle())
                .html(html)
                .build();

        try {
            resend.emails().send(request);
            log.info("New appeal notification sent to admin");
        } catch (ResendException e) {
            log.error("Failed to send appeal notification to admin: {}", e.getMessage());
        }
    }

    // ============================================================================
    // HTML EMAIL TEMPLATES
    // ============================================================================

    private String buildDisputeResolvedProviderEmail(
            String providerName, String jobTitle, 
            Dispute.DisputeResolution resolution, BigDecimal amount, String adminNotes) {
        
        String outcomeText = switch (resolution) {
            case PROVIDER_FULL -> "You will receive the full payment of $" + amount;
            case CUSTOMER_FULL -> "The customer will receive a full refund. No payment to you.";
            case SPLIT -> "You will receive a partial payment of $" + amount;
            case FIX_REQUIRED -> "You must fix the work to receive payment.";
        };

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
                        .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
                        .outcome { background-color: #E3F2FD; padding: 15px; border-radius: 5px; margin: 15px 0; }
                        .admin-notes { background-color: #FFF9C4; padding: 15px; border-radius: 5px; margin: 15px 0; }
                        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Elwaseet</h1>
                            <p>Dispute Resolved</p>
                        </div>
                        <div class="content">
                            <h2>Hello, %s</h2>
                            <p>The dispute for job "<strong>%s</strong>" has been resolved by our admin team.</p>
                            
                            <div class="outcome">
                                <h3>Resolution: %s</h3>
                                <p>%s</p>
                            </div>
                            
                            <div class="admin-notes">
                                <h3>Admin's Notes:</h3>
                                <p>%s</p>
                            </div>
                            
                            <p><strong>What happens next:</strong></p>
                            <p>You have 3 days to appeal this decision if you disagree. After that, the decision is final.</p>
                            
                            <p>Thank you for your patience.</p>
                        </div>
                        <div class="footer">
                            <p>© 2025 Elwaseet. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(providerName, jobTitle, resolution, outcomeText, adminNotes != null ? adminNotes : "No additional notes");
    }

    private String buildDisputeResolvedCustomerEmail(
            String customerName, String jobTitle, 
            Dispute.DisputeResolution resolution, BigDecimal amount, String adminNotes) {
        
        String outcomeText = switch (resolution) {
            case PROVIDER_FULL -> "The provider will receive the full payment. No refund to you.";
            case CUSTOMER_FULL -> "You will receive a full refund of $" + amount;
            case SPLIT -> "You will receive a partial refund of $" + amount;
            case FIX_REQUIRED -> "The provider must fix the work before payment is released.";
        };

        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
                        .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
                        .outcome { background-color: #E3F2FD; padding: 15px; border-radius: 5px; margin: 15px 0; }
                        .admin-notes { background-color: #FFF9C4; padding: 15px; border-radius: 5px; margin: 15px 0; }
                        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Elwaseet</h1>
                            <p>Dispute Resolved</p>
                        </div>
                        <div class="content">
                            <h2>Hello, %s</h2>
                            <p>The dispute for job "<strong>%s</strong>" has been resolved by our admin team.</p>
                            
                            <div class="outcome">
                                <h3>Resolution: %s</h3>
                                <p>%s</p>
                            </div>
                            
                            <div class="admin-notes">
                                <h3>Admin's Notes:</h3>
                                <p>%s</p>
                            </div>
                            
                            <p><strong>What happens next:</strong></p>
                            <p>You have 3 days to appeal this decision if you disagree. After that, the decision is final.</p>
                            
                            <p>Thank you for using Elwaseet.</p>
                        </div>
                        <div class="footer">
                            <p>© 2025 Elwaseet. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(customerName, jobTitle, resolution, outcomeText, adminNotes != null ? adminNotes : "No additional notes");
    }

    private String buildFixRequiredProviderEmail(String providerName, String jobTitle, String adminNotes) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; }
                        .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
                        .action-required { background-color: #FFECB3; padding: 15px; border-radius: 5px; margin: 15px 0; }
                        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>⚠️ Action Required</h1>
                            <p>Dispute Resolution: Fix Required</p>
                        </div>
                        <div class="content">
                            <h2>Hello, %s</h2>
                            <p>The dispute for job "<strong>%s</strong>" has been reviewed by our admin team.</p>
                            
                            <div class="action-required">
                                <h3>You Must Fix the Work</h3>
                                <p>The admin has determined that the work needs to be corrected before payment can be released.</p>
                                <p><strong>Admin's Notes:</strong></p>
                                <p>%s</p>
                            </div>
                            
                            <p><strong>What you need to do:</strong></p>
                            <ul>
                                <li>Review the admin's notes carefully</li>
                                <li>Complete the required fixes</li>
                                <li>Mark the job as complete again when done</li>
                            </ul>
                            
                            <p>The payment is still being held in escrow and will be released once the customer confirms the work is satisfactory.</p>
                        </div>
                        <div class="footer">
                            <p>© 2025 Elwaseet. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(providerName, jobTitle, adminNotes != null ? adminNotes : "No additional notes provided");
    }

    private String buildFixRequiredCustomerEmail(String customerName, String jobTitle, String adminNotes) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
                        .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
                        .info-box { background-color: #E3F2FD; padding: 15px; border-radius: 5px; margin: 15px 0; }
                        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Elwaseet</h1>
                            <p>Dispute Update</p>
                        </div>
                        <div class="content">
                            <h2>Hello, %s</h2>
                            <p>The dispute for job "<strong>%s</strong>" has been reviewed.</p>
                            
                            <div class="info-box">
                                <h3>Provider Will Fix the Work</h3>
                                <p>The admin has reviewed your dispute and determined that the provider should complete additional work to meet the agreed-upon standards.</p>
                                <p><strong>Admin's Notes:</strong></p>
                                <p>%s</p>
                            </div>
                            
                            <p><strong>What happens next:</strong></p>
                            <ul>
                                <li>The provider will complete the required fixes</li>
                                <li>You'll be notified when they mark the work as complete</li>
                                <li>You can then review and confirm the work</li>
                                <li>Payment remains secure in escrow until you're satisfied</li>
                            </ul>
                            
                            <p>Thank you for your patience.</p>
                        </div>
                        <div class="footer">
                            <p>© 2025 Elwaseet. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(customerName, jobTitle, adminNotes != null ? adminNotes : "No additional notes provided");
    }

    private String buildNewAppealAdminEmail(Dispute dispute, User appealedBy, String appealReason) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #F44336; color: white; padding: 20px; text-align: center; }
                        .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
                        .appeal-box { background-color: #FFEBEE; padding: 15px; border-radius: 5px; margin: 15px 0; }
                        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🚨 New Dispute Appeal</h1>
                            <p>Requires Admin Review</p>
                        </div>
                        <div class="content">
                            <h2>New Appeal Submitted</h2>
                            <p>A user has appealed a dispute resolution. Please review and take action.</p>
                            
                            <div class="appeal-box">
                                <p><strong>Dispute ID:</strong> %d</p>
                                <p><strong>Job:</strong> %s</p>
                                <p><strong>Appealed By:</strong> %s (%s)</p>
                                <p><strong>Original Resolution:</strong> %s</p>
                                <p><strong>Appeal Reason:</strong></p>
                                <p>%s</p>
                            </div>
                            
                            <p>Please review this appeal in the admin dashboard and make a final decision.</p>
                        </div>
                        <div class="footer">
                            <p>© 2025 Elwaseet Admin System</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(
                    dispute.getDisputeId(),
                    dispute.getJob().getTitle(),
                    appealedBy.getName(),
                    appealedBy.getEmail(),
                    dispute.getResolution(),
                    appealReason
                );
    }
}