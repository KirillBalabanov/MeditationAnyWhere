package com.kirillbalabanov.meditationanywhere.service;

import com.kirillbalabanov.meditationanywhere.entity.ProfileEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final UserService userService;
    private final FileService fileService;
    @Autowired
    public ProfileService(ProfileRepository profileRepository, UserService userService, FileService fileService) {
        this.profileRepository = profileRepository;
        this.userService = userService;
        this.fileService = fileService;
    }

    public ProfileEntity updateProfileSettings(long id, String bio, MultipartFile image) throws NoUserFoundException, IOException {
        UserEntity userEntity = userService.findById(id);
        ProfileEntity profileEntity = userEntity.getProfileEntity();

        if (!profileEntity.getAvatarPath().equals("")) {
            fileService.deleteFileFromUserDirectory(profileEntity.getAvatarPath());
        }

        String fileName = fileService.createFileInUserDirectory(image, id);

        profileEntity.setBio(bio);
        profileEntity.setAvatarUrl(fileService.getFileUrl(fileName, id));
        profileEntity.setAvatarPath(fileService.getFilePathInFileSys(fileName, id));

        return profileRepository.save(profileEntity);
    }

    public ProfileEntity updateProfileSettings(long id, String bio, boolean deleteAvatar) throws NoUserFoundException {
        UserEntity userEntity = userService.findById(id);

        ProfileEntity profileEntity = userEntity.getProfileEntity();

        if (deleteAvatar && !profileEntity.getAvatarPath().equals("")) {
           fileService.deleteFileFromUserDirectory(profileEntity.getAvatarPath());
            profileEntity.setAvatarUrl("");
            profileEntity.setAvatarPath("");
        }
        profileEntity.setBio(bio);
        return profileRepository.save(profileEntity);
    }

}
