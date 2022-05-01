package com.kirillbalabanov.meditationanywhere.controller;

import com.kirillbalabanov.meditationanywhere.entity.StatsEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.exception.user.LoginException;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.model.UserModel;
import com.kirillbalabanov.meditationanywhere.model.UserProfileModel;
import com.kirillbalabanov.meditationanywhere.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;

@RestController
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/registration")
    public ResponseEntity<?> registration(@RequestBody UserEntity userEntity) {
        try {
            userEntity = userService.register(userEntity);
        } catch (Exception e) {
            HashMap<String, String> hashMap = new HashMap<>();
            hashMap.put("error", e.getMessage());
            return ResponseEntity.ok().body(hashMap);
        }
        return ResponseEntity.ok().body(UserModel.toModel(userEntity));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody HashMap<String, String> hashMap,
                                   HttpServletRequest request, HttpServletResponse response) {
        if(hashMap.size() != 2) return ResponseEntity.badRequest().body("Invalid request params");
        String username = hashMap.get("username");
        String password = hashMap.get("password");
        HashMap<Object, Object> hm = new HashMap<>();

        try {
            if(username == null || password == null) throw new LoginException("Invalid input.");
            userService.isAbleToLogIn(username, password);
        } catch (Exception e) {
            hm.put("error", e.getMessage());
            return ResponseEntity.ok().body(hm);
        }

        hm.put("authenticated", true);
        hm.put("username", username);
        // generate new csrf token
        hm.put("csrf", generateAndSaveToken(request, response));
        // set auth.
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(username,
                password);
        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
        return ResponseEntity.ok().body(hm);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        new SecurityContextLogoutHandler().logout(httpServletRequest, httpServletResponse, authentication);

        // generate new csrf token
        String newToken = generateAndSaveToken(httpServletRequest, httpServletResponse);
        return ResponseEntity.ok().body(newToken);
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
        StatsEntity statsEntity = userEntity.getStatsEntity();

        return ResponseEntity.ok().body(UserProfileModel.toModel(statsEntity, userEntity));
    }

    @GetMapping("/verification/{activationCode}")
    public ResponseEntity<?> verification(@PathVariable String activationCode) {
        HashMap<String, String> hashMap = new HashMap<>();
        try {
            userService.verifyUserByActivationCode(activationCode);
        } catch (NoUserFoundException e) {
            hashMap.put("message", e.getMessage());
            return ResponseEntity.ok().body(hashMap);
        }
        hashMap.put("message", "Account is successfully activated!");
        return ResponseEntity.ok().body(hashMap);
    }

    private String generateAndSaveToken(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
        CookieCsrfTokenRepository cookieCsrfTokenRepository = CookieCsrfTokenRepository.withHttpOnlyFalse();
        CsrfToken newToken = cookieCsrfTokenRepository.generateToken(httpServletRequest);
        cookieCsrfTokenRepository.saveToken(newToken,
                httpServletRequest, httpServletResponse);
        return newToken.getToken();
    }
}
