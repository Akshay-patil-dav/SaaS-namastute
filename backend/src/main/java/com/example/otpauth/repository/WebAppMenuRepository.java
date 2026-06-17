package com.example.otpauth.repository;

import com.example.otpauth.model.WebAppMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WebAppMenuRepository extends JpaRepository<WebAppMenu, Long> {
    List<WebAppMenu> findByUserIdOrderByIdDesc(Long userId);
    Optional<WebAppMenu> findByIdAndUserId(Long id, Long userId);
}
