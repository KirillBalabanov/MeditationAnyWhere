package com.kirillbalabanov.meditationanywhere.service;

import com.kirillbalabanov.meditationanywhere.exception.audio.AudioNotFoundException;
import com.kirillbalabanov.meditationanywhere.model.AudioModel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.UUID;

@Service
public class FileService {
    private final String userFolderPath;
    private final String userFolderUrl;

    private final String serverFolderPath;
    private final String serverFolderUrl;

    public FileService(@Value("${app.user-folder-path}") String userFolderPath, @Value("${app.user-folder-url}") String userFolderUrl,
                       @Value("${app.server-folder-path}") String serverFolderPath, @Value("${app.server-folder-url}") String serverFolderUrl) {
        this.userFolderPath = userFolderPath;
        this.userFolderUrl = userFolderUrl;
        this.serverFolderPath = serverFolderPath;
        this.serverFolderUrl = serverFolderUrl;
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

    public String getUserFilePathInFileSys(String fileName, long id) {
        return userFolderPath + "/" + id + "/" + fileName;
    }

    public String getUserFileUrl(String fileName, long id) {
        return userFolderUrl + "/" + id + "/" + fileName;
    }

    public AudioModel[] getServerAudioDefaultArray() throws AudioNotFoundException {
        File defaultAudioFolder = new File(serverFolderPath + "/audio/default/");
        File[] audio = defaultAudioFolder.listFiles();
        if(audio == null) throw new AudioNotFoundException("No audio on server");

        AudioModel[] models = new AudioModel[audio.length];
        for (int i = 0; i < audio.length; i++) {
            String title = audio[i].getName();
            String url = serverFolderUrl + "/audio/default/" + title;
            models[i] = AudioModel.fromValues(url, title);
        }
        return models;
    }

}
