package com.kirillbalabanov.meditationanywhere.service;

import com.kirillbalabanov.meditationanywhere.entity.ProfileEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final UserService userService;
    private final String userFolderPath;
    private final String userFolderUrl;
    @Autowired
    public ProfileService(ProfileRepository profileRepository, UserService userService, @Value("${app.user-folder-path}") String userFolderPath,
                          @Value("${app.user-folder-url}") String userFolderUrl) {
        this.profileRepository = profileRepository;
        this.userService = userService;
        this.userFolderPath = userFolderPath;
        this.userFolderUrl = userFolderUrl;
    }

    public ProfileEntity updateProfileSettings(long id, String bio, MultipartFile image) throws NoUserFoundException, IOException {
        UserEntity userEntity = userService.findById(id);
        ProfileEntity profileEntity = userEntity.getProfileEntity();

        if (!profileEntity.getAvatarPath().equals("")) {
            new File(profileEntity.getAvatarPath()).delete();
        }

        String imageFileName = UUID.randomUUID() + "." + image.getOriginalFilename();
        String avatarPath = userFolderPath + "/" + id + "/" + imageFileName;

        File fileInFileSys = new File(avatarPath);
        if (!fileInFileSys.exists()) {
            fileInFileSys.mkdirs();
        }
        image.transferTo(fileInFileSys);

        profileEntity.setBio(bio);
        profileEntity.setAvatarUrl(userFolderUrl + "/" + id + "/" + imageFileName);
        profileEntity.setAvatarPath(avatarPath);

        return profileRepository.save(profileEntity);
    }

    public ProfileEntity updateProfileSettings(long id, String bio, boolean deleteAvatar) throws NoUserFoundException {
        UserEntity userEntity = userService.findById(id);

        ProfileEntity profileEntity = userEntity.getProfileEntity();

        if (deleteAvatar && !profileEntity.getAvatarPath().equals("")) {
            new File(profileEntity.getAvatarPath()).delete();
            profileEntity.setAvatarUrl("");
            profileEntity.setAvatarPath("");
        }
        profileEntity.setBio(bio);
        return profileRepository.save(profileEntity);
    }

}
