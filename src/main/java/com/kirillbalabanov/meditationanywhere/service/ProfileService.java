package com.kirillbalabanov.meditationanywhere.service;

import com.kirillbalabanov.meditationanywhere.entity.ProfileEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.model.AvatarModel;
import com.kirillbalabanov.meditationanywhere.model.ProfileModel;
import com.kirillbalabanov.meditationanywhere.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
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

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public ProfileEntity updateProfileSettings(long id, String bio, MultipartFile image) throws NoUserFoundException, IOException {
        UserEntity userEntity = userService.findById(id);
        ProfileEntity profileEntity = userEntity.getProfileEntity();

        if (profileEntity.getAvatarPath() != null) {
            fileService.deleteFile(profileEntity.getAvatarPath());
        }

        String fileName = fileService.createFileInUserDirectory(image, id);

        profileEntity.setBio(bio);
        profileEntity.setAvatarUrl(fileService.getUserFileUrl(fileName, id));
        profileEntity.setAvatarPath(fileService.getUserFilePathInFileSys(fileName, id));

        return profileRepository.save(profileEntity);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public ProfileEntity updateProfileSettings(long id, String bio, boolean deleteAvatar) throws NoUserFoundException {
        UserEntity userEntity = userService.findById(id);

        ProfileEntity profileEntity = userEntity.getProfileEntity();

        if (deleteAvatar && profileEntity.getAvatarPath() != null) {
            fileService.deleteFile(profileEntity.getAvatarPath());
            profileEntity.setAvatarUrl(null);
            profileEntity.setAvatarPath(null);
        }
        profileEntity.setBio(bio);
        return profileRepository.save(profileEntity);
    }

    @Transactional(readOnly = true)
    public ProfileModel getProfileModel(long userId) throws NoUserFoundException {

        UserEntity userEntity = userService.findById(userId);
        return ProfileModel.toModel(userEntity.getProfileEntity());
    }

    @Transactional(readOnly = true)
    public AvatarModel getAvatar(long userId) throws NoUserFoundException {

        UserEntity userEntity = userService.findById(userId);
        ProfileEntity profileEntity = userEntity.getProfileEntity();

        return new AvatarModel(profileEntity.getAvatarUrl());
    }
}
