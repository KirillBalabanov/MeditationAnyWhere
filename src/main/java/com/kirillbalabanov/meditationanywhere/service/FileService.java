package com.kirillbalabanov.meditationanywhere.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileService {
    private final String userFolderPath;
    private final String userFolderUrl;

    public FileService(@Value("${app.user-folder-path}") String userFolderPath, @Value("${app.user-folder-url}") String userFolderUrl) {
        this.userFolderPath = userFolderPath;
        this.userFolderUrl = userFolderUrl;
    }

    public String createFileInUserDirectory(MultipartFile file, long id) throws IOException {
        String fileName = UUID.randomUUID() + "." + file.getOriginalFilename();

        File fileInFileSys = new File(userFolderPath + "/" + id + "/" + fileName);
        if (!fileInFileSys.exists()) {
            fileInFileSys.mkdirs();
        }
        file.transferTo(fileInFileSys);

        return fileName;
    }

    public void deleteFileFromUserDirectory(String pathToFile) {
        new File(pathToFile).delete();
    }

    public String getFilePathInFileSys(String fileName, long id) {
        return userFolderPath + "/" + id + "/" + fileName;
    }

    public String getFileUrl(String fileName, long id) {
        return userFolderUrl + "/" + id + "/" + fileName;
    }
}
