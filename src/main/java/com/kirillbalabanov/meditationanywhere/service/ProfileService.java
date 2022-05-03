package com.kirillbalabanov.meditationanywhere.service;

import com.kirillbalabanov.meditationanywhere.entity.ProfileEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.repository.ProfileRepository;
import com.kirillbalabanov.meditationanywhere.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Optional;

@Service
public class ProfileService {
    private ProfileRepository profileRepository;
    private UserRepository userRepository;

    private final String profilePath;

    @Autowired
    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.profilePath = "D:\\Documents\\Projects\\GitHub\\meditationanywhere\\src\\main\\resources\\static\\profile";
    }

    public ProfileEntity updateProfileSettings(UserEntity userEntity, String bio, MultipartFile image) throws NoUserFoundException, IOException {
        ProfileEntity profileEntity = userEntity.getProfileEntity();

        File resultFile = createUserFolderAndSaveAvatar(userEntity.getId(), image);

        profileEntity.setBio(bio);
        profileEntity.setAvatarFilePath(resultFile.getPath());
        return profileRepository.save(profileEntity);
    }

    public ProfileEntity updateProfileSettings(UserEntity userEntity, String bio) throws NoUserFoundException, IOException {
        ProfileEntity profileEntity = userEntity.getProfileEntity();

        profileEntity.setBio(bio);

        return profileRepository.save(profileEntity);
    }

    public ProfileEntity updateProfileSettings(UserEntity userEntity, MultipartFile image) throws NoUserFoundException, IOException {
        ProfileEntity profileEntity = userEntity.getProfileEntity();

        File resultFile = createUserFolderAndSaveAvatar(userEntity.getId(), image);

        profileEntity.setAvatarFilePath(resultFile.getPath());
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
