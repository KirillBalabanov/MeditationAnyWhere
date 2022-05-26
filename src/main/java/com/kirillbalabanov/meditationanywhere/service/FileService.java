package com.kirillbalabanov.meditationanywhere.service;

import com.kirillbalabanov.meditationanywhere.exception.audio.AudioNotFoundException;
import com.kirillbalabanov.meditationanywhere.exception.file.FolderNotExistsException;
import com.kirillbalabanov.meditationanywhere.model.AudioModel;
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

    private final String serverFolderPath;
    private final String serverFolderUrl;

    private final String serverDefaultAudioPackRelativePath;

    private final String serverToggleAudioRelativePath;

    public FileService(@Value("${app.user-folder-path}") String userFolderPath, @Value("${app.user-folder-url}") String userFolderUrl,
                       @Value("${app.server-folder-path}") String serverFolderPath, @Value("${app.server-folder-url}") String serverFolderUrl,
                       @Value("${app.server-default-audio-pack-relative-path}") String serverDefaultAudioPackRelativePath,
                       @Value("${app.server-toggle-audio-relative-path}") String serverToggleAudioRelativePath) {
        this.userFolderPath = userFolderPath;
        this.userFolderUrl = userFolderUrl;
        this.serverFolderPath = serverFolderPath;
        this.serverFolderUrl = serverFolderUrl;
        this.serverDefaultAudioPackRelativePath = serverDefaultAudioPackRelativePath;
        this.serverToggleAudioRelativePath = serverToggleAudioRelativePath;
    }

    public String createFileInUserDirectory(MultipartFile file, long id) {
        String fileNameWithUUID = UUID.randomUUID() + "." + file.getOriginalFilename().replaceAll("[^A-Za-z1-9._]", "");

        File fileInFileSys = new File(userFolderPath + "/" + id + "/" + fileNameWithUUID);
        if (!fileInFileSys.exists()) {
            fileInFileSys.mkdirs();
        }
        try {
            file.transferTo(fileInFileSys);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return fileNameWithUUID;
    }

    public void deleteFile(String pathToFile) {
        new File(pathToFile).delete();
    }

    public void deleteUserFolder(long userId) {
        File userFolder = new File(userFolderPath + "/" + userId);
        File[] files = userFolder.listFiles();
        deleteAllFilesRecursively(files);
        userFolder.delete();
    }

    private void deleteAllFilesRecursively(File[] files) {
        for (File f : files) {
            deleteFileRecursively(f);
        }
    }

    private void deleteFileRecursively(File file) {
        if (file.isDirectory()) {
            File[] files = file.listFiles();
            if (files != null) {
                deleteAllFilesRecursively(files);
            }

            file.delete();
        }
        file.delete();
    }

    public String getUserFilePathInFileSys(String fileName, long id) {
        return userFolderPath + "/" + id + "/" + fileName;
    }

    public String getUserFileUrl(String fileName, long id) {
        return userFolderUrl + "/" + id + "/" + fileName;
    }

    public AudioModel[] getServerAudioDefaultArray() {
        File defaultAudioFolder = new File(serverFolderPath + serverDefaultAudioPackRelativePath + "/");
        if(!defaultAudioFolder.exists()) throw new FolderNotExistsException("Folder doesn't exist");
        File[] audio = defaultAudioFolder.listFiles();
        if(audio == null || audio.length == 0) throw new AudioNotFoundException("No audio on server");

        AudioModel[] models = new AudioModel[audio.length];
        for (int i = 0; i < audio.length; i++) {
            String title = audio[i].getName();
            String url = serverFolderUrl + serverDefaultAudioPackRelativePath + "/" + title;
            models[i] = AudioModel.fromValues(url, title);
        }
        return models;
    }

    public AudioModel getServerToggleAudio() {
        File folder = new File(serverFolderPath + serverToggleAudioRelativePath);
        if(!folder.exists()) throw new FolderNotExistsException("Folder doesn't exist");
        File[] files = folder.listFiles();
        if(files == null || files.length == 0) throw new AudioNotFoundException("No audio on server");
        String title = files[0].getName();
        String url = serverFolderUrl + serverToggleAudioRelativePath + "/" + title;
        return AudioModel.fromValues(url, title);
    }
}
