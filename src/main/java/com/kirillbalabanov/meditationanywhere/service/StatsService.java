package com.kirillbalabanov.meditationanywhere.service;

import com.kirillbalabanov.meditationanywhere.entity.StatsEntity;
import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.repository.StatsRepository;
import com.kirillbalabanov.meditationanywhere.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
public class StatsService {
    private final StatsRepository statsRepository;
    private final UserRepository userRepository;

    public StatsService(@Autowired StatsRepository statsRepository, @Autowired UserRepository userRepository) {
        this.statsRepository = statsRepository;
        this.userRepository = userRepository;
    }

    /**
     * Updates current user's {@link StatsEntity}.
     * <p>Updates last session_date, and streaks.</p>
     * <p>Adds minutesListened to current min_listened in db</p>
     * @param minutesListened session's listened minutes.
     * @param userId id of user, to which update would be used.
     * @return updates StatsEntity.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public StatsEntity updateStats(int minutesListened, long userId) {
        Optional<UserEntity> optionalUserEntity = userRepository.findById(userId);
        if(optionalUserEntity.isEmpty()) throw new NoUserFoundException("User not found.");

        UserEntity userEntity = optionalUserEntity.get();
        StatsEntity statsEntity = userEntity.getStatsEntity();

        update(statsEntity, minutesListened);

        // save updated statsEntity.
        statsRepository.save(statsEntity);
        return statsEntity;
    }

    private void update(StatsEntity statsEntity, int minutesListened) {
        Date currentSessionDate = new Date(new java.util.Date().getTime());
        boolean firstSession = statsEntity.getLastSessionsDate() == null;
        Date lastSessionsDate = statsEntity.getLastSessionsDate();

        statsEntity.setSessionsListened(statsEntity.getSessionsListened() + 1);
        statsEntity.setMinListened(statsEntity.getMinListened() + minutesListened);
        statsEntity.setLastSessionsDate(currentSessionDate);

        if (firstSession) {
            statsEntity.setCurrentStreak(1);
            statsEntity.setLongestStreak(1);
            return;
        }

        long daysBetween = ChronoUnit.DAYS.between(LocalDate.parse(currentSessionDate.toString()),
                LocalDate.parse(lastSessionsDate.toString()));

        if (Math.abs(daysBetween) > 1) {
            statsEntity.setCurrentStreak(1);
            return;
        }
        if (Math.abs(daysBetween) == 1) {
            statsEntity.setCurrentStreak(statsEntity.getCurrentStreak() + 1);
        }

        if (statsEntity.getCurrentStreak() > statsEntity.getLongestStreak()) {
            statsEntity.setLongestStreak(statsEntity.getCurrentStreak());
        }
    }
}
