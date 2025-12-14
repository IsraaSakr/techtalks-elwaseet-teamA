package com.elwaseet.backend.storage;

import org.springframework.web.multipart.MultipartFile;

public interface IFileStorageService {
    String saveJobPhoto(Long jobId, MultipartFile file);
}
