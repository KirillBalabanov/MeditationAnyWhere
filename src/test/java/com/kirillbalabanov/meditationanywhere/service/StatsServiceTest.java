package com.kirillbalabanov.meditationanywhere.service;

import com.kirillbalabanov.meditationanywhere.entity.StatsEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.repository.StatsRepository;
import com.kirillbalabanov.meditationanywhere.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Optional;


@SpringBootTest
class StatsServiceTest {

    @MockBean
    private StatsRepository statsRepository;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private StatsService statsService;

    @Test
    void updateStats_UserNotExists() {
        Mockito.doReturn(Optional.empty()).when(userRepository).findById(1L);
        Mockito.doReturn(new StatsEntity()).when(statsRepository).save(ArgumentMatchers.any(StatsEntity.class));

        Assertions.assertThrows(NoUserFoundException.class, () -> statsService.updateStats(5, 1));

        Mockito.verify(userRepository, Mockito.times(1)).findById(ArgumentMatchers.anyLong());
        Mockito.verify(statsRepository, Mockito.times(0)).save(ArgumentMatchers.any(StatsEntity.class));
    }
    @Test
    void updateStats_FirstSession() throws NoUserFoundException {
        UserEntity userEntity = new UserEntity
                ("username", "password", "email", "ROLE_USER", true, null);
        StatsEntity entityBeforeUpdate = new StatsEntity(1, 0, 0, 0, 0, null, userEntity);
        Date sessionsDate = new Date(new java.util.Date().getTime()); // service init current date and sets it as lastSessionsDate.
        StatsEntity entityAfterUpdate = new StatsEntity(1, 5, 1, 1, 1, sessionsDate, userEntity);

        userEntity.setId(1);
        userEntity.setStatsEntity(entityBeforeUpdate);

        Mockito.doReturn(Optional.of(userEntity)).when(userRepository).findById(userEntity.getId());
        Mockito.doReturn(entityAfterUpdate).when(statsRepository).save(ArgumentMatchers.any(StatsEntity.class));

        Assertions.assertEquals(entityAfterUpdate, statsService.updateStats(5, 1));

        Mockito.verify(userRepository, Mockito.times(1)).findById(ArgumentMatchers.anyLong());
        Mockito.verify(statsRepository, Mockito.times(1)).save(ArgumentMatchers.any(StatsEntity.class));
    }
    @Test
    void updateStats_UpdateCurrentAndLongestStreaks() throws NoUserFoundException {
        UserEntity userEntity = new UserEntity
                ("username", "password", "email", "ROLE_USER", true, null);
        // get yesterday's date
        Date lastSessionsDate = Date.valueOf(LocalDate.now().minus(1, ChronoUnit.DAYS).toString());
        StatsEntity entityBeforeUpdate = new StatsEntity(1, 10, 2, 1, 1, lastSessionsDate, userEntity);
        Date sessionsDate = new Date(new java.util.Date().getTime()); // service init current date and sets it as lastSessionsDate.
        StatsEntity entityAfterUpdate = new StatsEntity(1, 20, 3, 2, 2, sessionsDate, userEntity);

        userEntity.setId(1L);
        userEntity.setStatsEntity(entityBeforeUpdate);

        Mockito.doReturn(Optional.of(userEntity)).when(userRepository).findById(userEntity.getId());
        Mockito.doReturn(entityAfterUpdate).when(statsRepository).save(ArgumentMatchers.any(StatsEntity.class));

        Assertions.assertEquals(entityAfterUpdate, statsService.updateStats(10, 1));

        Mockito.verify(userRepository, Mockito.times(1)).findById(ArgumentMatchers.anyLong());
        Mockito.verify(statsRepository, Mockito.times(1)).save(ArgumentMatchers.any(StatsEntity.class));
    }

    @Test
    void updateStats_UpdateCurrentStreak_LongestStreakSame() throws NoUserFoundException {
        UserEntity userEntity = new UserEntity
                ("username", "password", "email", "ROLE_USER", true, null);
        // get yesterday's date
        Date lastSessionsDate = Date.valueOf(LocalDate.now().minus(1, ChronoUnit.DAYS).toString());
        StatsEntity entityBeforeUpdate = new StatsEntity(1, 30, 5, 1, 3, lastSessionsDate, userEntity);
        Date sessionsDate = new Date(new java.util.Date().getTime()); // service init current date and sets it as lastSessionsDate.
        StatsEntity entityAfterUpdate = new StatsEntity(1, 40, 6, 2, 3, sessionsDate, userEntity);

        userEntity.setId(1L);
        userEntity.setStatsEntity(entityBeforeUpdate);

        Mockito.doReturn(Optional.of(userEntity)).when(userRepository).findById(userEntity.getId());
        Mockito.doReturn(entityAfterUpdate).when(statsRepository).save(ArgumentMatchers.any(StatsEntity.class));

        Assertions.assertEquals(entityAfterUpdate, statsService.updateStats(10, 1));

        Mockito.verify(userRepository, Mockito.times(1)).findById(ArgumentMatchers.anyLong());
        Mockito.verify(statsRepository, Mockito.times(1)).save(ArgumentMatchers.any(StatsEntity.class));
    }

    @Test
    void updateStats_ResetCurrentStreak_LongestStreakSame() throws NoUserFoundException {
        UserEntity userEntity = new UserEntity
                ("username", "password", "email", "ROLE_USER", true, null);
        // get current date - 2 days so that current steak would be reset.
        Date lastSessionsDate = Date.valueOf(LocalDate.now().minus(2, ChronoUnit.DAYS).toString());
        StatsEntity entityBeforeUpdate = new StatsEntity(1, 30, 5, 3, 7, lastSessionsDate, userEntity);
        Date sessionsDate = new Date(new java.util.Date().getTime()); // service init current date and sets it as lastSessionsDate.
        StatsEntity entityAfterUpdate = new StatsEntity(1, 40, 6, 1, 7, sessionsDate, userEntity);

        userEntity.setId(1L);
        userEntity.setStatsEntity(entityBeforeUpdate);

        Mockito.doReturn(Optional.of(userEntity)).when(userRepository).findById(userEntity.getId());
        Mockito.doReturn(entityAfterUpdate).when(statsRepository).save(ArgumentMatchers.any(StatsEntity.class));

        Assertions.assertEquals(entityAfterUpdate, statsService.updateStats(10, 1));

        Mockito.verify(userRepository, Mockito.times(1)).findById(ArgumentMatchers.anyLong());
        Mockito.verify(statsRepository, Mockito.times(1)).save(ArgumentMatchers.any(StatsEntity.class));
    }

}