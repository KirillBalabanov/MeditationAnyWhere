package com.kirillbalabanov.meditationanywhere.service;

import com.kirillbalabanov.meditationanywhere.entity.AudioEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.exception.audio.AudioNotFoundException;
import com.kirillbalabanov.meditationanywhere.exception.audio.AudioTitleTakenException;
import com.kirillbalabanov.meditationanywhere.exception.audio.InvalidAudioTitleException;
import com.kirillbalabanov.meditationanywhere.model.AudioModel;
import com.kirillbalabanov.meditationanywhere.repository.AudioRepository;
import com.kirillbalabanov.meditationanywhere.util.validator.TitleValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
public class AudioService {
    private final AudioRepository audioRepository;
    private final UserService userService;

    private final FileService fileService;

    public AudioService(AudioRepository audioRepository, UserService userService,
                        FileService fileService) {
        this.audioRepository = audioRepository;
        this.userService = userService;
        this.fileService = fileService;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public AudioEntity addAudio(long userId, MultipartFile audioFile, String audioTitle) {
        UserEntity userEntity = userService.findById(userId);

        if(userEntity.getAudioEntityList().stream().anyMatch((el) -> el.getAudioTitle().equals(audioTitle))) {
            throw new AudioTitleTakenException("Audio with this title already exists.");
        }

        String fileName = fileService.createFileInUserDirectory(audioFile, userId);

        AudioEntity audioEntity = AudioEntity.createAudioEntity(audioTitle, fileService.getUserFileUrl(fileName, userId),
                fileService.getUserFilePathInFileSys(fileName, userId), userEntity);

        userEntity.getAudioEntityList().add(audioEntity);

        return audioRepository.save(audioEntity);
    }

    @Transactional(readOnly = true)
    public AudioModel[] getUserAudioInArrayModels(long userId) {
        UserEntity userEntity = userService.findById(userId);
        if(userEntity.getAudioEntityList().size() == 0) return null;
        return userEntity.getAudioEntityList().stream().map(AudioModel::toModel).toArray(AudioModel[]::new);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public AudioEntity updateAudioTitle(long userId, String url, String title) {
        if(!TitleValidator.isValidAudioTitle(title)) throw new InvalidAudioTitleException("Invalid audio title");
        UserEntity userEntity = userService.findById(userId);
        if(userEntity.getAudioEntityList().stream().anyMatch((el) -> el.getAudioTitle().equals(title))) {
            throw new AudioTitleTakenException("Audio with this title already exists.");
        }
        Optional<AudioEntity> optional = userEntity.getAudioEntityList().stream().filter((el) -> el.getAudioUrl().equals(url)).findFirst();
        if(optional.isEmpty()) throw new AudioNotFoundException("Audio not found.");

        AudioEntity audioEntity = optional.get();


        audioEntity.setAudioTitle(title);
        audioRepository.save(audioEntity);
        return audioEntity;
    }

    @Transactional(readOnly = true)
    public AudioEntity findUserAudioByUrl(long userId, String url) {
        UserEntity userEntity = userService.findById(userId);
        Optional<AudioEntity> optional = userEntity.getAudioEntityList().stream().filter((el) -> el.getAudioUrl().equals(url)).findFirst();
        if(optional.isEmpty()) throw new AudioNotFoundException("Audio not found.");
        return optional.get();
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public AudioEntity deleteUserAudioByUrl(long userId, String url) {
        UserEntity userEntity = userService.findById(userId);
        Optional<AudioEntity> optional = userEntity.getAudioEntityList().stream().filter((el) -> el.getAudioUrl().equals(url)).findFirst();
        if (optional.isEmpty()) throw new AudioNotFoundException("Audio not found.");
        AudioEntity audioEntity = optional.get();
        fileService.deleteFile(audioEntity.getAudioPath());
        userEntity.getAudioEntityList().remove(audioEntity);
        audioRepository.delete(audioEntity);
        return audioEntity;
    }
}
