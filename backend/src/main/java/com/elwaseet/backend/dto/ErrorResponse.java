package com.elwaseet.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Standard structure for all API error responses.
 * Supports both single-error and multi-error (validation) formats.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    private int status; // HTTP status code
    private String message; // Main error message
    private LocalDateTime timestamp; // When the error occurred
    private List<String> errors; // Optional: list of detailed validation errors

    /**
     * Constructor for single-error responses.
     */
    public ErrorResponse(int status, String message, LocalDateTime timestamp) {
        this.status = status;
        this.message = message;
        this.timestamp = timestamp;
        this.errors = null;
    }
}
