package com.kirillbalabanov.meditationanywhere.controller;

import com.kirillbalabanov.meditationanywhere.entity.StatsEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.exception.user.LoginException;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.model.ErrorModel;
import com.kirillbalabanov.meditationanywhere.model.UserModel;
import com.kirillbalabanov.meditationanywhere.model.UserProfileModel;
import com.kirillbalabanov.meditationanywhere.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;

@RestController
@RequestMapping(value = "/user/auth")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/registration")
    public ResponseEntity<?> registration(@RequestBody HashMap<String, String> hm) {
        if(hm.size() != 3) return ResponseEntity.badRequest().body("Invalid request params");

        String username = hm.get("username");
        String email = hm.get("email");
        String password = hm.get("password");

        UserEntity registeredUser;
        try {
            registeredUser = userService.register(username, email, password);
        } catch (Exception e) {
            return ResponseEntity.ok().body(ErrorModel.fromMessage(e.getMessage()));
        }
        return ResponseEntity.ok().body(UserModel.toModel(registeredUser));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody HashMap<String, String> hashMap,
                                   HttpServletRequest request, HttpServletResponse response) {
        if(hashMap.size() != 2) return ResponseEntity.badRequest().body("Invalid request params");
        String username = hashMap.get("username");
        String password = hashMap.get("password");

        HashMap<Object, Object> hm = new HashMap<>();
        try {
            userService.isAbleToLogIn(username, password);
        } catch (Exception e) {
            return ResponseEntity.ok().body(ErrorModel.fromMessage(e.getMessage()));
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

        HashMap<String, String> hm = new HashMap<>();
        hm.put("csrf", newToken);
        return ResponseEntity.ok().body(hm);
    }
    @GetMapping("/verification/{activationCode}")
    public ResponseEntity<?> verification(@PathVariable String activationCode) {
        HashMap<String, String> hashMap = new HashMap<>();
        try {
            userService.verifyUserByActivationCode(activationCode);
        } catch (NoUserFoundException e) {
            return ResponseEntity.ok().body(ErrorModel.fromMessage(e.getMessage()));
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
