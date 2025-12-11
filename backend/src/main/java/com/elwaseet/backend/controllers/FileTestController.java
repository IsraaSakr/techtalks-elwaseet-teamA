package com.elwaseet.backend.controllers;

import com.elwaseet.backend.services.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class FileTestController {

    private final FileStorageService fileStorageService;

    // -------------------------------------------------------------------------
    // ✅ TEST 1: Upload single file
    // -------------------------------------------------------------------------
    @PostMapping("/upload-single")
    public ResponseEntity<String> uploadSingle(
            @RequestPart("file") MultipartFile file,
            @RequestParam(defaultValue = "profiles") String folder) {

        String savedPath = fileStorageService.saveFile(file, folder);
        return ResponseEntity.ok(savedPath);
    }

    // -------------------------------------------------------------------------
    // ✅ TEST 2: Upload multiple files (MAX 5)
    // -------------------------------------------------------------------------
    @PostMapping("/upload-multiple")
    public ResponseEntity<List<String>> uploadMultiple(
            @RequestPart("files") List<MultipartFile> files,
            @RequestParam(defaultValue = "jobs") String folder) {

        List<String> savedPaths = fileStorageService.saveMultipleFiles(files, folder, 5);

        return ResponseEntity.ok(savedPaths);
    }
}
