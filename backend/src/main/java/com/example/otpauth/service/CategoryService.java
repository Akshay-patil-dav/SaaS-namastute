package com.example.otpauth.service;

import com.example.otpauth.dto.CategoryRequest;
import com.example.otpauth.model.Category;
import com.example.otpauth.repository.CategoryRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
@SuppressWarnings("null")
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findByUserId(com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    public Optional<Category> getCategoryById(@NonNull Long id) {
        return categoryRepository.findByIdAndUserId(Objects.requireNonNull(id), com.example.otpauth.util.SecurityUtils.getCurrentUserId());
    }

    public Category createCategory(CategoryRequest req) {
        Category c = new Category();
        c.setUserId(com.example.otpauth.util.SecurityUtils.getCurrentUserId());
        c.setName(req.getName());
        
        // Auto-generate slug if not provided
        if (req.getSlug() == null || req.getSlug().isBlank()) {
            c.setSlug(req.getName().toLowerCase().replaceAll("\\s+", "-").replaceAll("[^a-z0-9-]", ""));
        } else {
            c.setSlug(req.getSlug());
        }

        if (req.getStatus() != null) {
            c.setStatus(req.getStatus());
        }

        return Objects.requireNonNull(categoryRepository.save(c));
    }

    public Optional<Category> updateCategory(@NonNull Long id, CategoryRequest req) {
        return categoryRepository.findByIdAndUserId(Objects.requireNonNull(id), com.example.otpauth.util.SecurityUtils.getCurrentUserId()).map(c -> {
            c.setName(req.getName());
            if (req.getSlug() != null && !req.getSlug().isBlank()) {
                c.setSlug(req.getSlug());
            }
            if (req.getStatus() != null) {
                c.setStatus(req.getStatus());
            }
            return categoryRepository.save(c);
        });
    }

    public boolean deleteCategory(@NonNull Long id) {
        if (categoryRepository.existsByIdAndUserId(Objects.requireNonNull(id), com.example.otpauth.util.SecurityUtils.getCurrentUserId())) {
            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }


    public void bulkDeleteCategories(List<Long> ids) {
        if (ids != null && !ids.isEmpty()) {
            Long userId = com.example.otpauth.util.SecurityUtils.getCurrentUserId();
            List<Category> cats = categoryRepository.findAllById(ids);
            cats.removeIf(c -> !c.getUserId().equals(userId));
            categoryRepository.deleteAll(cats);
        }
    }
}
