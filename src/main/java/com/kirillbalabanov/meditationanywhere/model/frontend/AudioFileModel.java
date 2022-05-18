package com.kirillbalabanov.meditationanywhere.model.frontend;

import org.springframework.web.multipart.MultipartFile;

public record AudioFileModel(MultipartFile audioFile, String audioTitle) {
}
