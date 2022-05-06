package com.kirillbalabanov.meditationanywhere.service;

import com.kirillbalabanov.meditationanywhere.entity.AudioEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.exception.audio.AudioNotFoundException;
import com.kirillbalabanov.meditationanywhere.exception.audio.AudioTitleTakenException;
import com.kirillbalabanov.meditationanywhere.exception.audio.InvalidAudioTitleException;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.model.AudioModel;
import com.kirillbalabanov.meditationanywhere.repository.AudioRepository;
import com.kirillbalabanov.meditationanywhere.util.validator.TitleValidator;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    public AudioEntity addAudio(long userId, MultipartFile audioFile, String audioTitle) throws NoUserFoundException, IOException, AudioTitleTakenException {
        UserEntity userEntity = userService.findById(userId);

        if(userEntity.getAudioEntityList().stream().anyMatch((el) -> el.getAudioTitle().equals(audioTitle))) {
            throw new AudioTitleTakenException("Audio with this title already exists.");
        }

        String fileName = fileService.createFileInUserDirectory(audioFile, userId);

        AudioEntity audioEntity = AudioEntity.createAudioEntity(audioTitle, fileService.getFileUrl(fileName, userId),
                fileService.getFilePathInFileSys(fileName, userId), userEntity);

        userEntity.getAudioEntityList().add(audioEntity);

        return audioRepository.save(audioEntity);
    }

    public AudioModel[] getUserAudioInArrayModels(long userId) throws NoUserFoundException {
        UserEntity userEntity = userService.findById(userId);
        if(userEntity.getAudioEntityList().size() == 0) return null;
        return userEntity.getAudioEntityList().stream().map(AudioModel::toModel).toArray(AudioModel[]::new);
    }

    public AudioEntity updateAudioTitle(long userId, String url, String title) throws NoUserFoundException, AudioNotFoundException, InvalidAudioTitleException, AudioTitleTakenException {
        if(!TitleValidator.validateAudioTitle(title)) throw new InvalidAudioTitleException("Invalid audio title");
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

    public AudioEntity findUserAudioByUrl(long userId, String url) throws NoUserFoundException, AudioNotFoundException {
        UserEntity userEntity = userService.findById(userId);
        Optional<AudioEntity> optional = userEntity.getAudioEntityList().stream().filter((el) -> el.getAudioUrl().equals(url)).findFirst();
        if(optional.isEmpty()) throw new AudioNotFoundException("Audio not found.");
        return optional.get();
    }

    public void deleteUserAudioByUrl(long userId, String url) throws NoUserFoundException, AudioNotFoundException {
        UserEntity userEntity = userService.findById(userId);
        Optional<AudioEntity> optional = userEntity.getAudioEntityList().stream().filter((el) -> el.getAudioUrl().equals(url)).findFirst();
        if(optional.isEmpty()) throw new AudioNotFoundException("Audio not found.");
        AudioEntity audioEntity = optional.get();
        fileService.deleteFileFromUserDirectory(audioEntity.getAudioPath());
        userEntity.getAudioEntityList().remove(audioEntity);
        audioRepository.delete(audioEntity);
    }
}
