package com.kirillbalabanov.meditationanywhere.controller;

import com.kirillbalabanov.meditationanywhere.config.UserDet;
import com.kirillbalabanov.meditationanywhere.entity.ProfileEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.model.ProfileModel;
import com.kirillbalabanov.meditationanywhere.model.UserProfileModel;
import com.kirillbalabanov.meditationanywhere.service.ProfileService;
import com.kirillbalabanov.meditationanywhere.service.UserService;
import com.kirillbalabanov.meditationanywhere.util.validator.ContentTypeValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    private final UserService userService;
    private final ProfileService profileService;

    @Autowired
    public ProfileController(UserService userService, ProfileService profileService) {
        this.userService = userService;
        this.profileService = profileService;
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> showUsersProfile(@PathVariable String username) {
        UserEntity userEntity;
        try {
            userEntity = userService.findByUsername(username);
        } catch (NoUserFoundException e) {
            HashMap<String, String> hashMap = new HashMap<>();
            hashMap.put("error", e.getMessage());
            return ResponseEntity.ok().body(hashMap);
        }
        return ResponseEntity.ok().body(UserProfileModel.toModel(userEntity, userEntity.getStatsEntity(), userEntity.getProfileEntity()));
    }

    @PutMapping(value = "/settings/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProfileSettings(@RequestParam(value = "bio") String bio,
                                                   @RequestParam(value = "deleteAvatar") String delete,
                                                   @RequestParam(value = "image", required = false) MultipartFile image) {
        if (bio == null) return ResponseEntity.badRequest().body("Invalid arguments.");

        if(image != null && !ContentTypeValidator.isValidImage(image.getContentType()))
            return ResponseEntity.badRequest().body("Invalid type");

        HashMap<String, String> hm = new HashMap<>();
        boolean deleteAvatar = delete.equals("true");


        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof UserDet userDet)) return ResponseEntity.badRequest().body("user not authenticated");
        ProfileEntity profileEntity;

        try {
            if (image == null) {
                profileEntity = profileService.updateProfileSettings(userDet.getUserId(), bio, deleteAvatar);
            } else {
                profileEntity = profileService.updateProfileSettings(userDet.getUserId(), bio, image);
            }
        } catch (Exception e) {
            hm.put("error", e.getMessage());
            return ResponseEntity.ok().body(hm);
        }

        return ResponseEntity.ok().body(ProfileModel.toModel(profileEntity));
    }

    @GetMapping("/settings/settings")
    public ResponseEntity<?> getProfileEntitySettings() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(!(principal instanceof UserDet userDet)) return ResponseEntity.badRequest().body("user not authenticated");
        UserEntity userEntity;
        try {
            userEntity = userService.findById(userDet.getUserId());
        } catch (NoUserFoundException e) {
            HashMap<String, String> hm = new HashMap<>();
            hm.put("error", e.getMessage());
            return ResponseEntity.ok().body(hm);
        }
        ProfileModel model = ProfileModel.toModel(userEntity.getProfileEntity());
        return ResponseEntity.ok().body(model);
    }

    @GetMapping("/user/avatar")
    public ResponseEntity<?> avatarUrl() {
        HashMap<String, String> hm = new HashMap<>();
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(!(principal instanceof UserDet userDet)) return ResponseEntity.badRequest().body("user not authenticated");

        UserEntity userEntity;
        try {
            userEntity = userService.findById(userDet.getUserId());
        } catch (NoUserFoundException e) {
            hm.put("error", e.getMessage());
            return ResponseEntity.ok().body(hm);
        }
        hm.put("avatarUrl", userEntity.getProfileEntity().getAvatarUrl());
        return ResponseEntity.ok().body(hm);
    }
}
