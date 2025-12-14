package com.elwaseet.backend.controller;

import com.elwaseet.backend.dto.ErrorResponse;
import com.elwaseet.backend.exception.ResourceNotFoundException;
import com.elwaseet.backend.exception.ValidationException;
import com.elwaseet.backend.exception.BadRequestException;
import com.elwaseet.backend.exception.ConflictException;

import lombok.extern.slf4j.Slf4j;

import com.elwaseet.backend.exception.UnauthorizedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j 
@RestControllerAdvice
public class GlobalExceptionHandler {

        // -------------------------------------------------------------------------
        // 404 - Resource Not Found
        // -------------------------------------------------------------------------
        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {

                ErrorResponse error = new ErrorResponse(
                                HttpStatus.NOT_FOUND.value(),
                                ex.getMessage(),
                                LocalDateTime.now());

                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }

        // -------------------------------------------------------------------------
        // 400 - Custom Validation Exception
        // -------------------------------------------------------------------------
        @ExceptionHandler(ValidationException.class)
        public ResponseEntity<ErrorResponse> handleValidation(ValidationException ex) {

                ErrorResponse error = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage(),
                                LocalDateTime.now());

                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        // -------------------------------------------------------------------------
        // 400 - Spring @Valid Validation Errors
        // -------------------------------------------------------------------------
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(
                        MethodArgumentNotValidException ex) {

                List<String> fieldErrors = ex.getBindingResult()
                                .getFieldErrors()
                                .stream()
                                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                                .collect(Collectors.toList());

                ErrorResponse error = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                "Validation failed",
                                LocalDateTime.now(),
                                fieldErrors);

                return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        // -------------------------------------------------------------------------
        // 401 - Unauthorized (Custom)
        // -------------------------------------------------------------------------
        @ExceptionHandler(UnauthorizedException.class)
        public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException ex) {

                ErrorResponse error = new ErrorResponse(
                                HttpStatus.UNAUTHORIZED.value(),
                                ex.getMessage(),
                                LocalDateTime.now());

                return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
        }

        // -------------------------------------------------------------------------
        // 403 - Spring Security Access Denied
        // -------------------------------------------------------------------------
        @ExceptionHandler(AccessDeniedException.class)
        public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {

                ErrorResponse error = new ErrorResponse(
                                HttpStatus.FORBIDDEN.value(),
                                "Access is denied",
                                LocalDateTime.now());

                return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
        }

        // -------------------------------------------------------------------------
        // 500 - Generic Server Error (Catch All)
        // -------------------------------------------------------------------------
        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {

                log.error("Unexpected error occurred", ex);

                ErrorResponse error = new ErrorResponse(
                                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                                "An unexpected error occurred",
                                LocalDateTime.now());

                return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // -------------------------------------------------------------------------
        // 400 - Bad Request
        // -------------------------------------------------------------------------
        @ExceptionHandler(BadRequestException.class)
        public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException ex) {

        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                ex.getMessage(),
                LocalDateTime.now());

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        // -------------------------------------------------------------------------
        // 409 - Conflict
        // -------------------------------------------------------------------------
        @ExceptionHandler(ConflictException.class)
        public ResponseEntity<ErrorResponse> handleConflict(ConflictException ex) {

        ErrorResponse error = new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                ex.getMessage(),
                LocalDateTime.now());

        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
        }


        @ExceptionHandler(ResponseStatusException.class)
        public ResponseEntity<ErrorResponse> handleResponseStatusException(ResponseStatusException ex) {
        ErrorResponse error = new ErrorResponse(
                ex.getStatusCode().value(),
                ex.getReason(),
                LocalDateTime.now(),
                null
        );
        return new ResponseEntity<>(error, ex.getStatusCode());
        }
}
