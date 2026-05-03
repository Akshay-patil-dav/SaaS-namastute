package com.example.otpauth.repository;

import com.example.otpauth.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {

    @Query("SELECT p FROM Purchase p WHERE LOWER(p.supplier) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.reference) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Purchase> searchPurchases(@Param("query") String query);
}
