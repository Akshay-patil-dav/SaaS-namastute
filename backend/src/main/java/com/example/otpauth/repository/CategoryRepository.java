package com.example.otpauth.repository;

import com.example.otpauth.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUserId(Long userId);
    Optional<Category> findByIdAndUserId(Long id, Long userId);
    boolean existsByIdAndUserId(Long id, Long userId);

    Optional<Category> findBySlugAndUserId(String slug, Long userId);
    boolean existsBySlugAndUserId(String slug, Long userId);
    boolean existsByNameAndUserId(String name, Long userId);
}
