package com.example.otpauth.repository;

import com.example.otpauth.model.BomItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BomItemRepository extends JpaRepository<BomItem, Long> {
}
