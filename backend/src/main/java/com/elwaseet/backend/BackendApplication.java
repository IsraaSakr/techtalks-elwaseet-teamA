package com.elwaseet.backend;

import com.elwaseet.backend.config.EmailProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableAsync;
// Commented out - only uncomment when testing email
import com.elwaseet.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableAsync 
@EnableConfigurationProperties(EmailProperties.class) 
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	// Commented out - only uncomment when testing email

	@Bean
	CommandLineRunner testEmail(
			EmailService emailService,
			@Value("${resend.test.to}") String testTo) {
		return args -> {
			String id = emailService.sendTestEmail(testTo);
			System.out.println("Email sent. ID: " + id);
		};
	}
	

}