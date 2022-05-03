package com.kirillbalabanov.meditationanywhere.controller;

import com.kirillbalabanov.meditationanywhere.config.UserDet;
import com.kirillbalabanov.meditationanywhere.entity.ProfileEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.model.ProfileModel;
import com.kirillbalabanov.meditationanywhere.model.UserProfileModel;
import com.kirillbalabanov.meditationanywhere.service.ProfileService;
import com.kirillbalabanov.meditationanywhere.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.HashMap;

@RestController
public class ProfileController {

    private final UserService userService;
    private final ProfileService profileService;

    @Autowired
    public ProfileController(UserService userService, ProfileService profileService) {
        this.userService = userService;
        this.profileService = profileService;
    }

    @GetMapping("/profile/{username}")
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

    @PutMapping(value = "/profile/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProfileSettings(@RequestParam(value = "bio", required = true) String bio,
                                                   @RequestParam(value = "image", required = false) MultipartFile image) {
        if (bio == null) return ResponseEntity.badRequest().body("Invalid arguments.");

        UserDet userDet = (UserDet) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        ProfileEntity profileEntity;
        HashMap<String, String> hm = new HashMap<>();

        try {
            if (image == null) {
                profileEntity = profileService.updateProfileSettings(userDet.getUserId(), bio);
            } else {
                profileEntity = profileService.updateProfileSettings(userDet.getUserId(), bio, image);
            }
        } catch (Exception e) {
            hm.put("error", e.getMessage());
            return ResponseEntity.ok().body(hm);
        }

        return ResponseEntity.ok().body(ProfileModel.toModel(profileEntity));
    }

    @GetMapping("profile/settings")
    public ResponseEntity<?> getProfileEntitySettings() {
        UserDet userDet = (UserDet) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
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
}
