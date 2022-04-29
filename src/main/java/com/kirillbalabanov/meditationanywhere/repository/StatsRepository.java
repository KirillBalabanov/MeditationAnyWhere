package com.kirillbalabanov.meditationanywhere.repository;

import com.kirillbalabanov.meditationanywhere.entity.StatsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatsRepository extends JpaRepository<StatsEntity, Long> {
}
