package com.example.otpauth.repository;

import com.example.otpauth.model.LandingPageConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LandingPageConfigRepository extends JpaRepository<LandingPageConfig, Long> {
    Optional<LandingPageConfig> findByConfigKey(String configKey);
}
