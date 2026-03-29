package com.example.otpauth.repository;

import com.example.otpauth.model.PageBlock;
import com.example.otpauth.model.CustomPage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PageBlockRepository extends JpaRepository<PageBlock, Long> {
    List<PageBlock> findByPageOrderByOrderIndexAsc(CustomPage page);
    void deleteByPage(CustomPage page);
}
