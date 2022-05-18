package com.kirillbalabanov.meditationanywhere.controller;

import com.kirillbalabanov.meditationanywhere.config.UserDet;
import com.kirillbalabanov.meditationanywhere.model.AudioModel;
import com.kirillbalabanov.meditationanywhere.model.ErrorModel;
import com.kirillbalabanov.meditationanywhere.service.FileService;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping(value = "/server")
public class MainController {
    private final FileService fileService;

    public MainController(FileService fileService) {
        this.fileService = fileService;
    }

    @GetMapping("/principal")
    public ResponseEntity<?> principal() {
        HashMap<Object, Object> hashMap = new HashMap<>();
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof UserDet userDet)) {
            hashMap.put("authenticated", false);
            hashMap.put("username", "$anonymous");
        } else {
            hashMap.put("authenticated", true);
            hashMap.put("username", userDet.getUsername());
        }
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(hashMap);
    }

    @GetMapping("/audio/default")
    public ResponseEntity<?> getServerAudioDefault() {
        AudioModel[] audios;
        try {
            audios = fileService.getServerAudioDefaultArray();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ErrorModel.fromMessage(e.getMessage()));
        }
        return ResponseEntity.ok().cacheControl(CacheControl.maxAge(120, TimeUnit.MINUTES).cachePublic().mustRevalidate()).body(audios);
    }

    @GetMapping("/audio/toggle")
    public ResponseEntity<?> getServetToggleAudio() {
        AudioModel audioModel;
        try {
            audioModel = fileService.getServerToggleAudio();
        } catch (Exception e) {
            return ResponseEntity.ok().body(ErrorModel.fromMessage(e.getMessage()));
        }
        return ResponseEntity.ok().cacheControl(CacheControl.maxAge(120, TimeUnit.MINUTES).cachePublic().mustRevalidate()).body(audioModel);
    }

    @GetMapping("/csrf")
    public CsrfToken csrfToken(CsrfToken token) {
        return token;
    }
}

