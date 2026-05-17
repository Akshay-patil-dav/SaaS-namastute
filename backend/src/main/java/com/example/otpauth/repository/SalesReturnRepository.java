package com.example.otpauth.repository;

import com.example.otpauth.model.SalesReturn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface SalesReturnRepository extends JpaRepository<SalesReturn, Long> {

    List<SalesReturn> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COALESCE(SUM(s.grandTotal), 0) FROM SalesReturn s")
    BigDecimal sumAllGrandTotal();

    @Query("SELECT COALESCE(SUM(s.paidAmount), 0) FROM SalesReturn s")
    BigDecimal sumAllPaidAmount();

    @Query("SELECT COALESCE(SUM(s.dueAmount), 0) FROM SalesReturn s")
    BigDecimal sumAllDueAmount();

    @Query("SELECT s FROM SalesReturn s WHERE " +
           "LOWER(s.customerName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.referenceNo)  LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.status)       LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.paymentStatus) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.biller)       LIKE LOWER(CONCAT('%', :q, '%'))")
    List<SalesReturn> searchReturns(@Param("q") String q);
}
