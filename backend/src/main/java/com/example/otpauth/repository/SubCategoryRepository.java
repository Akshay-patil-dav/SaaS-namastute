package com.example.otpauth.repository;

import com.example.otpauth.model.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubCategoryRepository extends JpaRepository<SubCategory, Long> {
    void deleteAllByIdInBatch(Iterable<Long> ids);
}
