package com.kirillbalabanov.meditationanywhere.controller;

import com.kirillbalabanov.meditationanywhere.config.UserDet;
import com.kirillbalabanov.meditationanywhere.entity.AudioEntity;
import com.kirillbalabanov.meditationanywhere.exception.audio.AudioNotFoundException;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.model.AudioModel;
import com.kirillbalabanov.meditationanywhere.service.AudioService;
import com.kirillbalabanov.meditationanywhere.util.validator.ContentTypeValidator;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;

@RestController
@RequestMapping(value = "/audio")
public class AudioController {

    private final AudioService audioService;

    public AudioController(AudioService audioService) {
        this.audioService = audioService;
    }


    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addAudio(@RequestParam(name = "audio") MultipartFile audioFile, @RequestParam(name = "title") String audioTitle) {
        if (audioFile == null || !ContentTypeValidator.isValidAudio(audioFile.getContentType())) {
            return ResponseEntity.badRequest().body("Invalid arguments");
        }
        UserDet userDet = (UserDet) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AudioEntity audioEntity;
        try {
            audioEntity = audioService.addAudio(userDet.getUserId(), audioFile, audioTitle);
        } catch (Exception e) {
            HashMap<String, String> hm = new HashMap<>();
            hm.put("error", e.getMessage());
            return ResponseEntity.ok().body(hm);
        }
        return ResponseEntity.ok().body(AudioModel.toModel(audioEntity));
    }

    @GetMapping(value = "/get")
    public ResponseEntity<?> getAudioArray() {
        UserDet userDet = (UserDet) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AudioModel[] audioModels;
        try {
            audioModels = audioService.getUserAudioInArrayModels(userDet.getUserId());
        } catch (Exception e) {
            HashMap<String, String> hm = new HashMap<>();
            hm.put("error", e.getMessage());
            return ResponseEntity.ok().body(hm);
        }
        return ResponseEntity.ok().body(audioModels);
    }

    @PutMapping(value = "/update")
    public ResponseEntity<?> updateTitle(@RequestBody HashMap<String, String> hashMap) {
        String newTitle = hashMap.get("title");
        String audioUrl = hashMap.get("url");
        UserDet userDet = (UserDet) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AudioEntity audioEntity;
        try {
            audioEntity = audioService.updateAudioTitle(userDet.getUserId(), audioUrl, newTitle);
        } catch (Exception e) {
            HashMap<String, String> hm = new HashMap<>();
            hm.put("error", e.getMessage());
            return ResponseEntity.ok().body(hm);
        }
        return ResponseEntity.ok().body(AudioModel.toModel(audioEntity));
    }

    @DeleteMapping("/del")
    public ResponseEntity<?> deleteAudio(@RequestBody HashMap<String, String> audioObj) {
        String audioUrl = audioObj.get("url");
        UserDet userDet = (UserDet) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        HashMap<String, String> hm = new HashMap<>();
        try {
            audioService.deleteUserAudioByUrl(userDet.getUserId(), audioUrl);
        } catch (Exception e) {
            hm.put("error", e.getMessage());
            return ResponseEntity.ok().body(hm);
        }
        hm.put("deleted", audioUrl);
        return ResponseEntity.ok().body(hm);
    }
}
