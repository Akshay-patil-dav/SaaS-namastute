package com.example.otpauth.repository;

import com.example.otpauth.model.PurchaseReturn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PurchaseReturnRepository extends JpaRepository<PurchaseReturn, Long> {
    List<PurchaseReturn> findByUserId(Long userId);
    java.util.Optional<PurchaseReturn> findByIdAndUserId(Long id, Long userId);
    boolean existsByIdAndUserId(Long id, Long userId);

    @Query("SELECT p FROM PurchaseReturn p WHERE p.userId = :userId AND (LOWER(p.supplier) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.reference) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<PurchaseReturn> searchPurchaseReturnsByUserId(@Param("query") String query, @Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(p.total), 0) FROM PurchaseReturn p WHERE p.userId = :userId")
    Double sumTotalPurchaseReturnByUserId(@Param("userId") Long userId);
}
