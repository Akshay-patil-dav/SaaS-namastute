package com.example.otpauth.repository;

import com.example.otpauth.model.BillOfMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillOfMaterialRepository extends JpaRepository<BillOfMaterial, Long> {
    List<BillOfMaterial> findByUserId(Long userId);
    List<BillOfMaterial> findByUserIdAndProductId(Long userId, Long productId);
}
