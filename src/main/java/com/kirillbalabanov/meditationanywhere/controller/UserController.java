package com.kirillbalabanov.meditationanywhere.controller;

import com.kirillbalabanov.meditationanywhere.config.UserDet;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.model.EmailModel;
import com.kirillbalabanov.meditationanywhere.model.UserModel;
import com.kirillbalabanov.meditationanywhere.model.frontend.CodePasswordModel;
import com.kirillbalabanov.meditationanywhere.model.frontend.EmailPasswordModel;
import com.kirillbalabanov.meditationanywhere.model.frontend.PasswordModel;
import com.kirillbalabanov.meditationanywhere.model.frontend.UsernamePasswordModel;
import com.kirillbalabanov.meditationanywhere.service.UserService;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/users/current")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    @PutMapping("/change/username")
    public ResponseEntity<?> changeUsername(@RequestBody UsernamePasswordModel usernameModel) {
        UserDet userDet = (UserDet) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        UserEntity userEntity = userService.changeUsername(userDet.getUserId(), usernameModel.username(), usernameModel.password());

        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(UserModel.toModel(userEntity));
    }

    @PutMapping("/change/email/request")
    public ResponseEntity<?> changeEmailRequest(@RequestBody EmailPasswordModel emailPasswordModel) {
        UserDet userDet = (UserDet) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        UserEntity userEntity = userService.changeEmailRequest(userDet.getUserId(), emailPasswordModel.email(), emailPasswordModel.password());

        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(UserModel.toModel(userEntity));
    }

    @PutMapping("/change/email/verify")
    public ResponseEntity<?> changeEmailVerification(@RequestBody CodePasswordModel codePasswordModel) {

        UserEntity userEntity = userService.changeEmailVerification(codePasswordModel.code(), codePasswordModel.password());

        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(UserModel.toModel(userEntity));
    }

    @GetMapping("/change/email/code")
    public ResponseEntity<?> codeExists(@RequestParam String code) {
        String encryptedCode = userService.getEmailByCode(code);

        return ResponseEntity.ok().cacheControl(CacheControl.noCache()).body(EmailModel.toModel(encryptedCode));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(@RequestBody PasswordModel passwordModel, HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
        UserDet userDet = (UserDet) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        UserEntity deletedEntity = userService.deleteUserAccount(userDet.getUserId(), passwordModel.password());

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        new SecurityContextLogoutHandler().logout(httpServletRequest, httpServletResponse, authentication);

        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(UserModel.toModel(deletedEntity));
    }

}
