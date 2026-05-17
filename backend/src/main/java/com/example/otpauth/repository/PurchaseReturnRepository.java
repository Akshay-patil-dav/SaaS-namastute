package com.example.otpauth.repository;

import com.example.otpauth.model.PurchaseReturn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PurchaseReturnRepository extends JpaRepository<PurchaseReturn, Long> {

    @Query("SELECT p FROM PurchaseReturn p WHERE LOWER(p.supplier) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.reference) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<PurchaseReturn> searchPurchaseReturns(@Param("query") String query);

    @Query("SELECT COALESCE(SUM(p.total), 0) FROM PurchaseReturn p")
    Double sumTotalPurchaseReturn();
}
