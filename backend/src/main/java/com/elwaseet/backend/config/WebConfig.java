package com.elwaseet.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.lang.Nullable;

/**
 * Web MVC configuration for serving static resources.
 *
 * This configuration exposes uploaded files (e.g. images, documents)
 * through a public URL path while keeping them stored on the file system.
 * 
 * REFACTORED: Simplified to work with LocalFileStorageService's "uploads/" base directory
 * for consistency across the application.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Base directory used by LocalFileStorageService for all uploads.
     * This matches the BASE_UPLOAD_DIR constant in LocalFileStorageService.
     */
    private static final String UPLOAD_DIR = "uploads/";

    /**
     * Registers a resource handler that maps HTTP requests to files
     * located in the upload directory.
     *
     * Example:
     *  - Request:  /uploads/portfolio/image.jpg
     *  - File path: uploads/portfolio/image.jpg
     *
     * This configuration is consistent with LocalFileStorageService's file structure.
     *
     * @param registry Spring's resource handler registry
     */
    @Override
    public void addResourceHandlers(@Nullable ResourceHandlerRegistry registry) {
        if (registry == null) {
            return;
        }
        registry.addResourceHandler("/uploads/**")
                // Serve files directly from the file system using LocalFileStorageService's directory
                .addResourceLocations("file:" + UPLOAD_DIR)
                // Cache static resources for 1 hour to improve performance
                .setCachePeriod(3600);
    }
}