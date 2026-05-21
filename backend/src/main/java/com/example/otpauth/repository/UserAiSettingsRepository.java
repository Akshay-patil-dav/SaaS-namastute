package com.example.otpauth.repository;

import com.example.otpauth.model.UserAiSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserAiSettingsRepository extends JpaRepository<UserAiSettings, Long> {

    /**
     * Find the AI settings row for the user identified by their email.
     * Using explicit JPQL to avoid Spring Data ambiguity with nested property navigation.
     */
    @Query("SELECT s FROM UserAiSettings s WHERE s.user.email = :email")
    Optional<UserAiSettings> findByUserEmail(@Param("email") String email);
}
