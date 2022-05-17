package com.kirillbalabanov.meditationanywhere.controller;

import com.kirillbalabanov.meditationanywhere.config.UserDet;
import com.kirillbalabanov.meditationanywhere.entity.ProfileEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.model.AvatarModel;
import com.kirillbalabanov.meditationanywhere.model.ErrorModel;
import com.kirillbalabanov.meditationanywhere.model.ProfileModel;
import com.kirillbalabanov.meditationanywhere.model.UserProfileModel;
import com.kirillbalabanov.meditationanywhere.service.ProfileService;
import com.kirillbalabanov.meditationanywhere.service.UserService;
import com.kirillbalabanov.meditationanywhere.util.validator.ContentTypeValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/user/profile")
public class ProfileController {

    private final UserService userService;
    private final ProfileService profileService;

    @Autowired
    public ProfileController(UserService userService, ProfileService profileService) {
        this.userService = userService;
        this.profileService = profileService;
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> showUserProfile(@PathVariable String username) {
        UserEntity userEntity;
        try {
            userEntity = userService.findByUsername(username);
        } catch (NoUserFoundException e) {
            return ResponseEntity.ok().body(ErrorModel.fromMessage(e.getMessage()));
        }
        return ResponseEntity.ok().cacheControl(CacheControl.noCache().cachePublic()).body(UserProfileModel.toModel(userEntity, userEntity.getStatsEntity(), userEntity.getProfileEntity()));
    }

    @PutMapping(value = "/settings/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProfileSettings(@RequestParam(value = "bio") String bio,
                                                   @RequestParam(value = "deleteAvatar") String delete,
                                                   @RequestParam(value = "image", required = false) MultipartFile image) {
        if (bio == null) return ResponseEntity.badRequest().body("Invalid arguments.");

        if(image != null && !ContentTypeValidator.isValidImage(image.getContentType()))
            return ResponseEntity.badRequest().body("Invalid type");

        boolean deleteAvatar = delete.equals("true");

        UserDet userDet = (UserDet) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        ProfileEntity profileEntity;
        try {
            if (image == null) {
                profileEntity = profileService.updateProfileSettings(userDet.getUserId(), bio, deleteAvatar);
            } else {
                profileEntity = profileService.updateProfileSettings(userDet.getUserId(), bio, image);
            }
        } catch (Exception e) {
            return ResponseEntity.ok().body(ErrorModel.fromMessage(e.getMessage()));
        }

        return ResponseEntity.ok().body(ProfileModel.toModel(profileEntity));
    }

    @GetMapping("/settings/get")
    public ResponseEntity<?> getProfileEntitySettings() {
        UserDet userDet = (UserDet) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        ProfileModel profileModel;
        try {
            profileModel = profileService.getProfileModel(userDet.getUserId());
        } catch (NoUserFoundException e) {
            return ResponseEntity.ok().body(ErrorModel.fromMessage(e.getMessage()));
        }
        return ResponseEntity.ok().cacheControl(CacheControl.noCache().cachePrivate()).body(profileModel);
    }

    @GetMapping("/avatar/get")
    public ResponseEntity<?> avatarUrl() {
        UserDet userDet = (UserDet) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        AvatarModel avatarModel;
        try {
            avatarModel = profileService.getAvatar(userDet.getUserId());
        } catch (NoUserFoundException e) {
            return ResponseEntity.ok().body(ErrorModel.fromMessage(e.getMessage()));
        }
        return ResponseEntity.ok().cacheControl(CacheControl.noCache().cachePrivate()).body(avatarModel);
    }
}
