package com.elwaseet.backend.dto.common;

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
@AllArgsConstructor  // This already creates the 4-argument constructor
public class ErrorResponse {

    private int status;
    private String message;
    private LocalDateTime timestamp;
    private List<String> errors;

    // Custom constructor for single-error responses (3 arguments)
    public ErrorResponse(int status, String message, LocalDateTime timestamp) {
        this.status = status;
        this.message = message;
        this.timestamp = timestamp;
        this.errors = null;  // No validation errors
    }
}