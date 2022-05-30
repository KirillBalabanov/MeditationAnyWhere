package com.kirillbalabanov.meditationanywhere.controller;

import com.kirillbalabanov.meditationanywhere.config.UserDet;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.model.AudioModel;
import com.kirillbalabanov.meditationanywhere.model.PrincipalModel;
import com.kirillbalabanov.meditationanywhere.service.FileService;
import com.kirillbalabanov.meditationanywhere.service.UserService;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping(value = "/api/server")
public class MainController {
    private final FileService fileService;
    private final UserService userService;

    public MainController(FileService fileService, UserService userService) {
        this.fileService = fileService;
        this.userService = userService;
    }

    @GetMapping("/principal")
    public ResponseEntity<?> principal() {

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof UserDet userDet)) {
            return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(null);
        }

        UserEntity userEntity = userService.getPrincipal(userDet.getUserId());

        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(PrincipalModel.toModel(userEntity));
    }

    @GetMapping("/audios/default")
    public ResponseEntity<?> getServerAudioDefault() {
        AudioModel[] audios = fileService.getServerAudioDefaultArray();

        return ResponseEntity.ok().cacheControl(CacheControl.maxAge(120, TimeUnit.MINUTES).cachePublic().mustRevalidate()).body(audios);
    }

    @GetMapping("/audios/toggle")
    public ResponseEntity<?> getServetToggleAudio() {
        AudioModel audioModel = fileService.getServerToggleAudio();
        return ResponseEntity.ok().cacheControl(CacheControl.maxAge(120, TimeUnit.MINUTES).cachePublic().mustRevalidate()).body(audioModel);
    }

    @GetMapping("/csrf")
    public CsrfToken csrfToken(CsrfToken token) {
        return token;
    }
}

