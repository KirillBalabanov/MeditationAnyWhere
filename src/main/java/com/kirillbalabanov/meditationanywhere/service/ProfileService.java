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

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final UserService userService;
    private final String userFolderPath;
    private final String userFolderUrl;

    private static final int indexOfSubstringUrlMatchingFolder = 8;
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

        if(!profileEntity.getAvatarUrl().equals("")) { // delete avatar if exists
            new File(userFolderPath + "/" + profileEntity.getAvatarUrl().substring(indexOfSubstringUrlMatchingFolder)).delete();
        }

        String imageUrl = saveFileInUserFolder(id, image);

        profileEntity.setBio(bio);
        profileEntity.setAvatarUrl(imageUrl);
        return profileRepository.save(profileEntity);
    }

    public ProfileEntity updateProfileSettings(long id, String bio, boolean deleteAvatar) throws NoUserFoundException {
        UserEntity userEntity = userService.findById(id);

        ProfileEntity profileEntity = userEntity.getProfileEntity();

        profileEntity.setBio(bio);
        if (deleteAvatar) {
            new File(userFolderPath + "/" + profileEntity.getAvatarUrl().substring(indexOfSubstringUrlMatchingFolder)).delete();
            profileEntity.setAvatarUrl("");
        }

        return profileRepository.save(profileEntity);
    }

    private String saveFileInUserFolder(long id, MultipartFile file) throws IOException {
        String imageFileName = file.getOriginalFilename();
        File fileInFileSys = new File(userFolderPath + "/" + id + "/" + imageFileName);
        if (!fileInFileSys.exists()) {
            fileInFileSys.mkdirs();
        }
        file.transferTo(fileInFileSys);

        return userFolderUrl + "/" + id + "/" + imageFileName;
    }
}
