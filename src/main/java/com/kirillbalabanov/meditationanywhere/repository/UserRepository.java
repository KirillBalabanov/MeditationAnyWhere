package com.kirillbalabanov.meditationanywhere.repository;

import com.kirillbalabanov.meditationanywhere.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByUsername(String username);

    Optional<UserEntity> findByEmail(String email);

    Optional<UserEntity> findByActivationCode(String activationCode);

    @Modifying
    @Query("delete from UserEntity u where u.isActivated = false and u.registrationDate <= :curDateMinus")
    void deleteAllUnverifiedAccounts(@Param("curDateMinus") Date curDateMinus);
}
