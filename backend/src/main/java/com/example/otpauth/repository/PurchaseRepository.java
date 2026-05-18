package com.example.otpauth.repository;

import com.example.otpauth.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

    @Query("SELECT p FROM Purchase p WHERE LOWER(p.supplier) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.reference) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Purchase> searchPurchases(@Param("query") String query);

    @Query("SELECT COALESCE(SUM(p.total), 0) FROM Purchase p")
    Double sumTotalPurchase();

    @Query("SELECT COALESCE(SUM(p.total), 0) FROM Purchase p WHERE p.status IS NULL OR LOWER(p.status) NOT IN ('return', 'returned')")
    Double sumTotalActivePurchase();

    @Query("SELECT COALESCE(SUM(p.total), 0) FROM Purchase p WHERE p.status IS NOT NULL AND LOWER(p.status) IN ('return', 'returned')")
    Double sumTotalPurchaseReturns();

    @Query("SELECT COUNT(p) FROM Purchase p WHERE p.status IS NULL OR LOWER(p.status) NOT IN ('return', 'returned')")
    Long countActivePurchases();

    @Query("SELECT COUNT(p) FROM Purchase p WHERE p.status IS NOT NULL AND LOWER(p.status) IN ('return', 'returned')")
    Long countPurchaseReturns();
}
