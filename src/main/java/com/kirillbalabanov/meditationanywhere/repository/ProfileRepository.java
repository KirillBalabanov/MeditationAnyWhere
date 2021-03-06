package com.kirillbalabanov.meditationanywhere.repository;

import com.kirillbalabanov.meditationanywhere.entity.ProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileRepository extends JpaRepository<ProfileEntity, Long> {
}
