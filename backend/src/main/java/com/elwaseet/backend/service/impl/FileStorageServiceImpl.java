package com.elwaseet.backend.service.impl;

import com.elwaseet.backend.service.FileStorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Implementation of {@link FileStorageService} responsible for
 * handling file upload, validation, storage, and deletion.
 *
 * This service stores files on the local file system and exposes
 * web-accessible paths for later retrieval.
 */
@Service
@Slf4j
public class FileStorageServiceImpl implements FileStorageService {

    /**
     * Base directory where uploaded files are stored.
     * Configurable via application properties.
     */
    @Value("${app.file.upload-dir:./uploads}")
    private String uploadDir;

    /**
     * Maximum allowed file size in bytes.
     * Default is 10MB.
     */
    @Value("${app.file.max-size:10485760}")
    private long maxFileSize;

    /**
     * Allowed MIME types for uploaded files.
     */
    @Value("${app.file.allowed-types:image/jpeg,image/png,image/gif,image/webp}")
    private String[] allowedTypes;

    /**
     * Saves a single file to the configured upload directory.
     *
     * @param file   the multipart file to store
     * @param folder subdirectory under the upload directory
     * @return web-accessible relative path of the stored file
     */
    @Override
    public String saveFile(MultipartFile file, String folder) {
        try {
            // Validate file before any filesystem operation
            validateFile(file);

            String fileName = generateFileName(file);
            Path folderPath = Paths.get(uploadDir, folder);

            // Ensure target directory exists
            Files.createDirectories(folderPath);

            Path targetLocation = folderPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            log.info("File saved successfully: {} -> {}", file.getOriginalFilename(), targetLocation);

            // Return the public-facing URL path
            return String.format("/uploads/%s/%s", folder, fileName);

        } catch (IOException e) {
            log.error("Failed to store file: {}", file.getOriginalFilename(), e);
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }

    /**
     * Saves multiple files atomically.
     * If one file fails, previously saved files are deleted.
     *
     * @param files    list of files to upload
     * @param folder   target subdirectory
     * @param maxCount maximum allowed number of files
     * @return list of saved file paths
     */
    @Override
    public List<String> saveMultipleFiles(List<MultipartFile> files, String folder, int maxCount) {

        if (files == null || files.isEmpty()) {
            throw new RuntimeException("No files provided");
        }

        if (files.size() > maxCount) {
            throw new RuntimeException("Too many files. Maximum allowed: " + maxCount);
        }

        List<String> savedPaths = new ArrayList<>();

        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            try {
                validateFile(file);
                savedPaths.add(saveFile(file, folder));
                log.info("Saved file {}/{}: {}", i + 1, files.size(), file.getOriginalFilename());
            } catch (Exception e) {
                // Roll back previously saved files
                for (String savedPath : savedPaths) {
                    deleteFile(savedPath);
                }
                throw new RuntimeException(
                        "Failed to upload file " + file.getOriginalFilename() + ": " + e.getMessage(), e);
            }
        }
        return savedPaths;
    }

    /**
     * Deletes a file from the filesystem using its relative path.
     *
     * @param filePath relative or web-accessible file path
     */
    @Override
    public void deleteFile(String filePath) {
        try {
            // Normalize path for filesystem access
            if (filePath.startsWith("/")) {
                filePath = filePath.substring(1);
            }

            Path file = Paths.get(".", filePath).normalize();
            boolean deleted = Files.deleteIfExists(file);

            if (deleted) {
                log.info("Deleted file: {}", filePath);
            } else {
                log.warn("File not found for deletion: {}", filePath);
            }
        } catch (IOException e) {
            log.error("Failed to delete file: {}", filePath, e);
            throw new RuntimeException("Failed to delete file: " + e.getMessage(), e);
        }
    }

    /**
     * Validates a single uploaded file for size, type, name, and security risks.
     *
     * @param file multipart file to validate
     */
    @Override
    public void validateFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("File is empty or null");
        }

        // Validate file size
        if (file.getSize() > maxFileSize) {
            throw new RuntimeException(
                    "File size exceeds " + (maxFileSize / (1024 * 1024)) + "MB limit");
        }

        // Validate MIME type
        String contentType = file.getContentType();
        if (contentType == null) {
            throw new RuntimeException("File has no content type");
        }

        boolean isValidType = false;
        for (String allowedType : allowedTypes) {
            if (contentType.startsWith(allowedType)
                    || contentType.equals(allowedType)
                    || allowedType.equals("*")) {
                isValidType = true;
                break;
            }
        }

        if (!isValidType) {
            throw new RuntimeException("Invalid file type: " + contentType);
        }

        // Validate file name
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            throw new RuntimeException("File has no name");
        }

        // Block potentially dangerous extensions
        String lowerCaseFilename = originalFilename.toLowerCase();
        if (lowerCaseFilename.endsWith(".exe")
                || lowerCaseFilename.endsWith(".sh")
                || lowerCaseFilename.endsWith(".bat")
                || lowerCaseFilename.endsWith(".js")
                || lowerCaseFilename.endsWith(".php")) {
            throw new RuntimeException("File type not allowed for security reasons");
        }

        log.debug("File validation passed: {} ({} bytes, {})",
                originalFilename, file.getSize(), contentType);
    }

    /**
     * Validates a list of files with a maximum count constraint.
     *
     * @param files    list of multipart files
     * @param maxCount maximum allowed number of files
     */
    @Override
    public void validateFiles(List<MultipartFile> files, int maxCount) {

        if (files == null) {
            throw new RuntimeException("File list is null");
        }

        if (files.isEmpty()) {
            throw new RuntimeException("No files provided");
        }

        if (files.size() > maxCount) {
            throw new RuntimeException(
                    "Too many files. Maximum allowed: " + maxCount + ", received: " + files.size());
        }

        for (int i = 0; i < files.size(); i++) {
            try {
                validateFile(files.get(i));
            } catch (Exception e) {
                throw new RuntimeException(
                        "File " + (i + 1) + " is invalid: " + e.getMessage(), e);
            }
        }
    }

    /**
     * Generates a unique and safe filename for storage.
     *
     * @param file uploaded multipart file
     * @return sanitized unique file name
     */
    private String generateFileName(MultipartFile file) {

        String originalFileName = file.getOriginalFilename();
        String extension = "";

        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }

        // Generate unique filename
        String timestamp = String.valueOf(System.currentTimeMillis());
        String uuid = UUID.randomUUID().toString().substring(0, 8);

        // Sanitize extension
        extension = extension.toLowerCase();
        if (!extension.matches("\\.[a-z0-9]{2,6}")) {
            extension = ".jpg";
        }

        return timestamp + "_" + uuid + extension;
    }

    /**
     * Resolves a relative path to an absolute filesystem path.
     *
     * @param relativePath relative or web-accessible path
     * @return absolute normalized path
     */
    public Path getAbsolutePath(String relativePath) {
        if (relativePath.startsWith("/")) {
            relativePath = relativePath.substring(1);
        }
        return Paths.get(uploadDir).resolve(relativePath).normalize().toAbsolutePath();
    }
}
