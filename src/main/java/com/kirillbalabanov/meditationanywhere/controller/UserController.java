package com.kirillbalabanov.meditationanywhere.controller;

import com.kirillbalabanov.meditationanywhere.entity.StatsEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.model.UserModel;
import com.kirillbalabanov.meditationanywhere.model.UserProfileModel;
import com.kirillbalabanov.meditationanywhere.service.StatsService;
import com.kirillbalabanov.meditationanywhere.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.UUID;

@RestController
public class UserController {
    private final UserService userService;
    private final StatsService statsService;

    @Autowired
    public UserController(UserService userService, StatsService statsService) {
        this.userService = userService;
        this.statsService = statsService;
    }

    // change ro rest controller, exchange with js json.
    @PostMapping("/registration")
    public ResponseEntity<?> addUser(@RequestBody UserEntity userEntity) {
        String uuid = UUID.randomUUID().toString();
        userEntity.setActivated(false);
        userEntity.setActivationCode(uuid);
        userEntity.setRole("USER_ROLE");
        long userId;
        try {
            userId = userService.register(userEntity).getId();
        } catch (Exception e) {
            HashMap<String, String> hashMap = new HashMap<>();
            hashMap.put("error", e.getMessage());
            return ResponseEntity.ok().body(hashMap);
        }
        // init stats with user.
        statsService.initializeWithUser(StatsEntity.initStatsEntity(), userId);

        // send verification email
        userService.sendVerificationEmailTo(uuid, userEntity.getUsername(), userEntity.getEmail());

        return ResponseEntity.ok().body(UserModel.toModel(userEntity));
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<?> showUsersProfile(@PathVariable String username, Model model) {
        UserEntity userEntity;
        try {
            userEntity = userService.findByUsername(username);
        } catch (NoUserFoundException e) {
            HashMap<String, String> hashMap = new HashMap<>();
            hashMap.put("error", e.getMessage());
            return ResponseEntity.ok().body(hashMap);
        }
        StatsEntity statsEntity = userEntity.getStatsEntity();

        return ResponseEntity.ok().body(UserProfileModel.toModel(statsEntity, userEntity));
    }

    @GetMapping("/verification/{activationCode}")
    public ResponseEntity<?> verification(@PathVariable String activationCode) {
        HashMap<String, String> hashMap = new HashMap<>();
        try {
            userService.verify(activationCode);
        } catch (NoUserFoundException e) {
            hashMap.put("error", "Invalid activation code");
            return ResponseEntity.ok().body(hashMap);
        }
        hashMap.put("message", "Account is successfully activated!");
        return ResponseEntity.ok().body(hashMap);
    }
}
