package com.example.otpauth.repository;

import com.example.otpauth.model.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    java.util.List<Brand> findByUserId(Long userId);
    java.util.Optional<Brand> findByIdAndUserId(Long id, Long userId);
    boolean existsByIdAndUserId(Long id, Long userId);
}
