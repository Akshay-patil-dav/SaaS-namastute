package com.example.otpauth.repository;

import com.example.otpauth.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    List<Purchase> findByUserId(Long userId);
    java.util.Optional<Purchase> findByIdAndUserId(Long id, Long userId);
    boolean existsByIdAndUserId(Long id, Long userId);

    @Query("SELECT p FROM Purchase p WHERE p.userId = :userId AND (LOWER(p.supplier) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.reference) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Purchase> searchPurchasesByUserId(@Param("query") String query, @Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(p.total), 0) FROM Purchase p WHERE p.userId = :userId")
    Double sumTotalPurchaseByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(p.total), 0) FROM Purchase p WHERE p.userId = :userId AND (p.status IS NULL OR LOWER(p.status) NOT IN ('return', 'returned'))")
    Double sumTotalActivePurchaseByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(p.total), 0) FROM Purchase p WHERE p.userId = :userId AND p.status IS NOT NULL AND LOWER(p.status) IN ('return', 'returned')")
    Double sumTotalPurchaseReturnsByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(p) FROM Purchase p WHERE p.userId = :userId AND (p.status IS NULL OR LOWER(p.status) NOT IN ('return', 'returned'))")
    Long countActivePurchasesByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(p) FROM Purchase p WHERE p.userId = :userId AND p.status IS NOT NULL AND LOWER(p.status) IN ('return', 'returned')")
    Long countPurchaseReturnsByUserId(@Param("userId") Long userId);
}
