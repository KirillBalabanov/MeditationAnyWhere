package com.kirillbalabanov.meditationanywhere.repository;

import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    public Optional<UserEntity> findByUsername(String username);
    public Optional<UserEntity> findByEmail(String email);

    public Optional<UserEntity> findByActivationCode(String activationCode);
}
