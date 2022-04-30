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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
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


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody HashMap<String, String> hashMap) {
        if(hashMap.size() != 2) return ResponseEntity.badRequest().body("Invalid request params");
        String username = hashMap.get("username");
        String password = hashMap.get("password");
        HashMap<Object, Object> hm = new HashMap<>();

        // finding user in db
        UserEntity userEntity;
        try {
            userEntity = userService.findByUsername(username);
        } catch (NoUserFoundException e) {
            hm.put("error", e.getMessage());
            return ResponseEntity.ok().body(hm);
        }

        // verify password
        if (!userService.verifyPassword(password, userEntity)) {
            hm.put("error", "Incorrect password");
            return ResponseEntity.ok().body(hm);
        }

        hm.put("authenticated", true);
        hm.put("username", username);
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(username,
                password);
        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
        return ResponseEntity.ok().body(hm);
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        SecurityContextHolder.getContext().setAuthentication(null);
        return ResponseEntity.ok().body(null);
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
