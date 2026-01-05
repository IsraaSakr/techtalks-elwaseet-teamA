package com.elwaseet.backend.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FileStorageService {

    /**
     * Saves a single file inside a specific folder.
     *
     * @param file   uploaded file
     * @param folder target folder (profiles, jobs, portfolios, disputes)
     * @return saved file path
     */
    String saveFile(MultipartFile file, String folder);

    /**
     * Saves multiple files with a maximum allowed count.
     *
     * @param files    list of uploaded files
     * @param folder   target folder
     * @param maxCount maximum allowed file count
     * @return list of saved file paths
     */
    List<String> saveMultipleFiles(List<MultipartFile> files, String folder, int maxCount);

    /**
     * Deletes a file from the file system.
     *
     * @param filePath path of the file to delete
     */
    void deleteFile(String filePath);

    /**
     * Validates a single uploaded image.
     *
     * @param file uploaded file
     */
    void validateFile(MultipartFile file);

    /**
     * Validates multiple uploaded images with a count limit.
     *
     * @param files    list of uploaded files
     * @param maxCount maximum allowed count
     */
    void validateFiles(List<MultipartFile> files, int maxCount);
}
