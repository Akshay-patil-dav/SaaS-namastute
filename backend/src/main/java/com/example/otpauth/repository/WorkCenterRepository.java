package com.example.otpauth.repository;

import com.example.otpauth.model.WorkCenter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkCenterRepository extends JpaRepository<WorkCenter, Long> {
    List<WorkCenter> findByUserId(Long userId);
}
