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
    List<SalesReturn> findByUserId(Long userId);
    java.util.Optional<SalesReturn> findByIdAndUserId(Long id, Long userId);
    boolean existsByIdAndUserId(Long id, Long userId);

    List<SalesReturn> findAllByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT COALESCE(SUM(s.grandTotal), 0) FROM SalesReturn s WHERE s.userId = :userId")
    BigDecimal sumAllGrandTotalByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(s.paidAmount), 0) FROM SalesReturn s WHERE s.userId = :userId")
    BigDecimal sumAllPaidAmountByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(s.dueAmount), 0) FROM SalesReturn s WHERE s.userId = :userId")
    BigDecimal sumAllDueAmountByUserId(@Param("userId") Long userId);

    @Query("SELECT s FROM SalesReturn s WHERE s.userId = :userId AND (" +
           "LOWER(s.customerName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.referenceNo)  LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.status)       LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.paymentStatus) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.biller)       LIKE LOWER(CONCAT('%', :q, '%')))")
    List<SalesReturn> searchReturnsByUserId(@Param("q") String q, @Param("userId") Long userId);
}
