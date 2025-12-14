package com.elwaseet.backend.storage;

// import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.UUID;

@Service
//@Profile("dev")  auto-loaded only in dev profile <--????
public class MockFileStorageService implements IFileStorageService {

    @Override
    public String saveJobPhoto(Long jobId, MultipartFile file) {
String originalName = file.getOriginalFilename();
if (originalName == null || originalName.isBlank()) {
    // fallback: generate a safe name
    originalName = "file_" + UUID.randomUUID() + ".dat";
}

String safeName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
String path = "/uploads/jobs/" + jobId + "_" + safeName;
return path;
    }
}

