package com.elwaseet.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC configuration for serving static resources.
 *
 * This configuration exposes uploaded files (e.g. images, documents)
 * through a public URL path while keeping them stored on the file system.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Base directory on the file system where uploaded files are stored.
     *
     * Can be configured via application properties using:
     * app.file.upload-dir
     * Defaults to "./uploads" if not specified.
     */
    @Value("${app.file.upload-dir:./uploads}")
    private String uploadDir;

    /**
     * Registers a resource handler that maps HTTP requests to files
     * located in the upload directory.
     *
     * Example:
     *  - Request:  /uploads/image.jpg
     *  - File path: {uploadDir}/image.jpg
     *
     * @param registry Spring's resource handler registry
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        registry.addResourceHandler("/uploads/**")
                // Serve files directly from the file system
                .addResourceLocations("file:" + uploadDir + "/")
                // Cache static resources for 1 hour to improve performance
                .setCachePeriod(3600);
    }
}
