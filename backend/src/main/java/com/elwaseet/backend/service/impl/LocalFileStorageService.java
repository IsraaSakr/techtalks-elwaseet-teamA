package com.elwaseet.backend.service.impl;

import com.elwaseet.backend.exception.ValidationException;
import com.elwaseet.backend.service.FileStorageService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@Slf4j
@Service
@Primary // Tell Spring to use this as default
public class LocalFileStorageService implements FileStorageService {

    private static final String BASE_UPLOAD_DIR = "uploads/";
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp");

    // -------------------------------------------------------------------------
    // ✅ Save SINGLE file with optional prefix
    // -------------------------------------------------------------------------
    @Override
    public String saveFile(MultipartFile file, String folder) {

        validateFile(file);

        Path uploadPath = Paths.get(BASE_UPLOAD_DIR + folder);
        createDirectoryIfNotExists(uploadPath);

        String extension = getExtension(file.getOriginalFilename());
        String uniqueName = UUID.randomUUID().toString();
        String finalFileName = uniqueName + extension;

        Path finalPath = uploadPath.resolve(finalFileName);

        try {
            Files.copy(file.getInputStream(), finalPath, StandardCopyOption.REPLACE_EXISTING);
            log.info("File saved: {}", finalPath);
            return BASE_UPLOAD_DIR + folder + "/" + finalFileName;

        } catch (IOException e) {
            log.error("Failed to save file", e);
            throw new ValidationException("File upload failed");
        }
    }

    // -------------------------------------------------------------------------
    // ✅ Save MULTIPLE files with indexed prefix (prefix_0, prefix_1, …)
    // -------------------------------------------------------------------------
    @Override
    public List<String> saveMultipleFiles(List<MultipartFile> files, String folder, int maxCount) {

        validateFiles(files, maxCount);

        Path uploadPath = Paths.get(BASE_UPLOAD_DIR + folder);
        createDirectoryIfNotExists(uploadPath);

        List<String> savedPaths = new ArrayList<>();

        int index = 0;
        for (MultipartFile file : files) {

            String extension = getExtension(file.getOriginalFilename());
            String finalFileName = "file_" + index + "_" + UUID.randomUUID() + extension;
            Path finalPath = uploadPath.resolve(finalFileName);

            try {
                Files.copy(file.getInputStream(), finalPath, StandardCopyOption.REPLACE_EXISTING);
                savedPaths.add(BASE_UPLOAD_DIR + folder + "/" + finalFileName);
                log.info("File saved: {}", finalPath);
            } catch (IOException e) {
                log.error("Failed to save multiple files", e);
                throw new ValidationException("Multiple file upload failed");
            }

            index++;
        }

        return savedPaths;
    }

    // -------------------------------------------------------------------------
    // ✅ Validate SINGLE file
    // -------------------------------------------------------------------------
    @Override
    public void validateFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new ValidationException("Uploaded file is required");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ValidationException("File exceeds maximum size of 5MB");
        }

        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new ValidationException("Only JPEG, PNG, and WEBP images are allowed");
        }
    }

    // -------------------------------------------------------------------------
    // ✅ Validate MULTIPLE files
    // -------------------------------------------------------------------------
    @Override
    public void validateFiles(List<MultipartFile> files, int maxCount) {

        if (files == null || files.isEmpty()) {
            throw new ValidationException("At least one file must be uploaded");
        }

        if (files.size() > maxCount) {
            throw new ValidationException("Maximum allowed files: " + maxCount);
        }

        for (MultipartFile file : files) {
            validateFile(file);
        }
    }

    // -------------------------------------------------------------------------
    // ✅ Delete file safely with logging
    // -------------------------------------------------------------------------
    @Override
    public void deleteFile(String filePath) {

        try {
            Path path = Paths.get(filePath);

            if (Files.exists(path)) {
                Files.delete(path);
                log.info("File deleted: {}", filePath);
            } else {
                log.warn("Attempted to delete non-existing file: {}", filePath);
            }

        } catch (IOException e) {
            log.error("Failed to delete file: {}", filePath, e);
            throw new ValidationException("Failed to delete file");
        }
    }

    // -------------------------------------------------------------------------
    // ✅ Helpers
    // -------------------------------------------------------------------------
    private void createDirectoryIfNotExists(Path path) {
        try {
            if (!Files.exists(path)) {
                Files.createDirectories(path);
                log.info("Created directory: {}", path);
            }
        } catch (IOException e) {
            throw new ValidationException("Could not create upload directory");
        }
    }

    private String getExtension(String filename) {

        if (filename == null || !filename.contains(".")) {
            throw new ValidationException("Invalid file name");
        }

        return filename.substring(filename.lastIndexOf("."));
    }
}
