package com.example.otpauth.repository;

import com.example.otpauth.model.Setting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SettingRepository extends JpaRepository<Setting, Long> {
    List<Setting> findByUserId(Long userId);
    java.util.Optional<Setting> findByIdAndUserId(Long id, Long userId);
    boolean existsByIdAndUserId(Long id, Long userId);

    Optional<Setting> findBySettingKeyAndUserId(String settingKey, Long userId);
}
