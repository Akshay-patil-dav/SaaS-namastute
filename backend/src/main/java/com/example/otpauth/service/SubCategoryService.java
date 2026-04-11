package com.example.otpauth.service;

import com.example.otpauth.dto.SubCategoryRequest;
import com.example.otpauth.model.Category;
import com.example.otpauth.model.SubCategory;
import com.example.otpauth.repository.CategoryRepository;
import com.example.otpauth.repository.SubCategoryRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@SuppressWarnings("null")
public class SubCategoryService {

    private final SubCategoryRepository subCategoryRepository;
    private final CategoryRepository categoryRepository;

    public SubCategoryService(SubCategoryRepository subCategoryRepository, CategoryRepository categoryRepository) {
        this.subCategoryRepository = subCategoryRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<SubCategory> getAllSubCategories() {
        return subCategoryRepository.findAll();
    }

    public Optional<SubCategory> getSubCategoryById(@NonNull Long id) {
        return subCategoryRepository.findById(Objects.requireNonNull(id));
    }

    public SubCategory createSubCategory(SubCategoryRequest req) {
        SubCategory sc = new SubCategory();
        sc.setName(req.getName());
        sc.setCategoryCode(req.getCategoryCode());
        sc.setDescription(req.getDescription());
        sc.setImage(req.getImage());
        
        if (req.getStatus() != null) {
            sc.setStatus(req.getStatus());
        }

        if (req.getCategoryId() != null) {
            Optional<Category> cat = categoryRepository.findById(req.getCategoryId());
            cat.ifPresent(sc::setCategory);
        }

        return Objects.requireNonNull(subCategoryRepository.save(sc));
    }

    public Optional<SubCategory> updateSubCategory(@NonNull Long id, SubCategoryRequest req) {
        return subCategoryRepository.findById(Objects.requireNonNull(id)).map(sc -> {
            sc.setName(req.getName());
            sc.setCategoryCode(req.getCategoryCode());
            sc.setDescription(req.getDescription());
            sc.setImage(req.getImage());
            
            if (req.getStatus() != null) {
                sc.setStatus(req.getStatus());
            }

            if (req.getCategoryId() != null) {
                Optional<Category> cat = categoryRepository.findById(req.getCategoryId());
                cat.ifPresent(sc::setCategory);
            }
            
            return subCategoryRepository.save(sc);
        });
    }

    public boolean deleteSubCategory(@NonNull Long id) {
        if (subCategoryRepository.existsById(Objects.requireNonNull(id))) {
            subCategoryRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public void bulkDeleteSubCategories(List<Long> ids) {
        if (ids != null && !ids.isEmpty()) {
            subCategoryRepository.deleteAllByIdInBatch(ids);
        }
    }
}
