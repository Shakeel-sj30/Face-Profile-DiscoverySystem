package com.facediscovery.validators;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Component
public class ImageValidator {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB limit
    private static final List<String> ALLOWED_TYPES = List.of(
            "image/jpeg", "image/png", "image/webp", "image/jpg"
    );

    public void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded image file is empty or missing.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Image size exceeds maximum allowable limit of 10MB (Payload Too Large).");
        }

        String contentType = file.getContentType();
        if (contentType != null && !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Unsupported image format. Allowed formats: JPEG, PNG, WEBP.");
        }
    }
}
