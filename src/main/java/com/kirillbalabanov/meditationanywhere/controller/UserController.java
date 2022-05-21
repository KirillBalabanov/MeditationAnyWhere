package com.kirillbalabanov.meditationanywhere.controller;

import com.kirillbalabanov.meditationanywhere.config.UserDet;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.model.EmailModel;
import com.kirillbalabanov.meditationanywhere.model.ErrorModel;
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
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    @PutMapping("/change/username")
    public ResponseEntity<?> changeUsername(@RequestBody UsernamePasswordModel usernameModel) {
        UserDet userDet = (UserDet) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserModel userModel;
        try {
            userModel = userService.changeUsername(userDet.getUserId(), usernameModel.username(), usernameModel.password());
        } catch (Exception e) {
            return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(ErrorModel.fromMessage(e.getMessage()));
        }
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(userModel);
    }

    @PutMapping("/change/email")
    public ResponseEntity<?> changeEmailRequest(@RequestBody EmailPasswordModel emailPasswordModel) {
        UserDet userDet = (UserDet) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserModel userModel;
        try {
            userModel = userService.changeEmailRequest(userDet.getUserId(), emailPasswordModel.email(), emailPasswordModel.password());
        } catch (Exception e) {
            return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(ErrorModel.fromMessage(e.getMessage()));
        }
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(userModel);
    }

    @PutMapping("/change/email/verify")
    public ResponseEntity<?> changeEmailVerification(@RequestBody CodePasswordModel codePasswordModel) {
        UserModel userModel;
        try {
            userModel = userService.changeEmailVerification(codePasswordModel.code(), codePasswordModel.password());
        } catch (Exception e) {
            return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(ErrorModel.fromMessage(e.getMessage()));
        }
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(userModel);
    }

    @GetMapping("/change/email/code-exists/{code}")
    public ResponseEntity<?> codeExists(@PathVariable String code) {
        EmailModel emailModel;
        try {
            emailModel = userService.getEmailByCode(code);
        } catch (NoUserFoundException e) {
            return ResponseEntity.ok().cacheControl(CacheControl.noCache()).body(ErrorModel.fromMessage(e.getMessage()));
        }
        return ResponseEntity.ok().cacheControl(CacheControl.noCache()).body(emailModel);
    }

    @DeleteMapping("/delete/account")
    public ResponseEntity<?> deleteUser(@RequestBody PasswordModel passwordModel, HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
        UserDet userDet = (UserDet) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserModel deletedModel;
        try {
            deletedModel = userService.deleteAccountByUserId(userDet.getUserId(), passwordModel.password());
        } catch (Exception e) {
            return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(ErrorModel.fromMessage(e.getMessage()));
        }

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        new SecurityContextLogoutHandler().logout(httpServletRequest, httpServletResponse, authentication);

        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(deletedModel);
    }

}
