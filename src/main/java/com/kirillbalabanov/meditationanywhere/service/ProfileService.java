package com.kirillbalabanov.meditationanywhere.service;

import com.kirillbalabanov.meditationanywhere.entity.ProfileEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final UserService userService;
    private final String profilePath;

    @Autowired
    public ProfileService(ProfileRepository profileRepository, UserService userService) {
        this.profileRepository = profileRepository;
        this.userService = userService;
        this.profilePath = "D:\\Documents\\Projects\\GitHub\\meditationanywhere\\src\\main\\resources\\static\\profile";
    }

    public ProfileEntity updateProfileSettings(long id, String bio, MultipartFile image) throws NoUserFoundException, IOException {
        UserEntity userEntity = userService.findById(id);
        ProfileEntity profileEntity = userEntity.getProfileEntity();

        File resultFile = createUserFolderAndSaveAvatar(id, image);

        profileEntity.setBio(bio);
        profileEntity.setAvatarFilePath(resultFile.getPath());
        return profileRepository.save(profileEntity);
    }

    public ProfileEntity updateProfileSettings(long id, String bio) throws NoUserFoundException {
        UserEntity userEntity = userService.findById(id);

        ProfileEntity profileEntity = userEntity.getProfileEntity();

        profileEntity.setBio(bio);

        return profileRepository.save(profileEntity);
    }

    private File createUserFolderAndSaveAvatar(long id, MultipartFile image) throws IOException {
        File resultFileFolder = new File(profilePath + "/" + id);

        if (!resultFileFolder.exists()) {
            resultFileFolder.mkdir();
        }
        File resultFile = new File(resultFileFolder + "/" + image.getOriginalFilename());
        image.transferTo(resultFile);
        return resultFile;
    }

}
