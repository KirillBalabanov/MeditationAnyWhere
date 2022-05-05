package com.kirillbalabanov.meditationanywhere.repository;

import com.kirillbalabanov.meditationanywhere.entity.AudioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AudioRepository extends JpaRepository<AudioEntity, Long> {
}
