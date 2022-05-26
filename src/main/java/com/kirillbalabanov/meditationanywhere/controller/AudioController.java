package com.kirillbalabanov.meditationanywhere.controller;

import com.kirillbalabanov.meditationanywhere.config.UserDet;
import com.kirillbalabanov.meditationanywhere.entity.AudioEntity;
import com.kirillbalabanov.meditationanywhere.exception.validation.ValidationException;
import com.kirillbalabanov.meditationanywhere.model.AudioModel;
import com.kirillbalabanov.meditationanywhere.model.frontend.AudioFileModel;
import com.kirillbalabanov.meditationanywhere.service.AudioService;
import com.kirillbalabanov.meditationanywhere.util.validator.ContentTypeValidator;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;

@RestController
@RequestMapping(value = "/user/audio")
public class AudioController {

    private final AudioService audioService;

    public AudioController(AudioService audioService) {
        this.audioService = audioService;
    }


    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addAudio(@ModelAttribute AudioFileModel audioFileModel) {
        String audioTitle = audioFileModel.audioTitle();
        MultipartFile audioFile = audioFileModel.audioFile();

        if (audioFile == null || !ContentTypeValidator.isValidAudio(audioFile.getContentType())) throw new ValidationException("Invalid type");

        UserDet userDet = (UserDet) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AudioEntity audioEntity = audioService.addAudio(userDet.getUserId(), audioFile, audioTitle);

        return ResponseEntity.ok().body(AudioModel.toModel(audioEntity));
    }

    @GetMapping(value = "/get")
    public ResponseEntity<?> getAudioArray() {
        UserDet userDet = (UserDet) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AudioModel[] audioModels = audioService.getUserAudioInArrayModels(userDet.getUserId());

        return ResponseEntity.ok().cacheControl(CacheControl.noCache().cachePrivate()).body(audioModels);
    }

    @PutMapping(value = "/update")
    public ResponseEntity<?> updateTitle(@RequestBody AudioModel audioModel) {
        String newTitle = audioModel.getAudioTitle();
        String audioUrl = audioModel.getAudioUrl();
        UserDet userDet = (UserDet) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AudioEntity audioEntity = audioService.updateAudioTitle(userDet.getUserId(), audioUrl, newTitle);

        return ResponseEntity.ok().body(AudioModel.toModel(audioEntity));
    }

    @DeleteMapping("/del")
    public ResponseEntity<?> deleteAudio(@RequestBody HashMap<String, String> audioObj) {
        String audioUrl = audioObj.get("url");
        UserDet userDet = (UserDet) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        AudioEntity deleted = audioService.deleteUserAudioByUrl(userDet.getUserId(), audioUrl);

        return ResponseEntity.ok().body(AudioModel.toModel(deleted));
    }

}
