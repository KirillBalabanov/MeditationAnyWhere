package com.kirillbalabanov.meditationanywhere.controller;

import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.model.ErrorModel;
import com.kirillbalabanov.meditationanywhere.model.UserModel;
import com.kirillbalabanov.meditationanywhere.model.frontend.UsernamePasswordModel;
import com.kirillbalabanov.meditationanywhere.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;

@RestController
@RequestMapping(value = "/user/auth")
public class AuthController {
    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
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
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(UserModel.toModel(registeredUser));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UsernamePasswordModel usernamePasswordModel) {

        String username = usernamePasswordModel.username();
        String password = usernamePasswordModel.password();

        UserEntity userEntity;
        try {
            userEntity = userService.isAbleToLogIn(username, password);
        } catch (Exception e) {
            return ResponseEntity.ok().body(ErrorModel.fromMessage(e.getMessage()));
        }

        // set auth.
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(username,
                password);
        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);

        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(UserModel.toModel(userEntity));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        new SecurityContextLogoutHandler().logout(httpServletRequest, httpServletResponse, authentication);

        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(null);
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
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(hashMap);
    }

}
