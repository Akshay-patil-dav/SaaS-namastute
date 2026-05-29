package com.example.otpauth.repository;

import com.example.otpauth.model.SaleOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface SaleOrderRepository extends JpaRepository<SaleOrder, Long> {
    List<SaleOrder> findByUserId(Long userId);
    java.util.Optional<SaleOrder> findByIdAndUserId(Long id, Long userId);
    boolean existsByIdAndUserId(Long id, Long userId);

    List<SaleOrder> findAllByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT s FROM SaleOrder s WHERE s.userId = :userId AND (" +
           "LOWER(s.customerName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.referenceNo) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.status) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.paymentStatus) LIKE LOWER(CONCAT('%', :q, '%')))")
    List<SaleOrder> searchOrdersByUserId(@Param("q") String q, @Param("userId") Long userId);

    /** Count all sale orders whose date equals the given date (today). */
    long countByDateAndUserId(LocalDate date, Long userId);

    /** Sum grandTotal for all sale orders on a given date (returns null if none). */
    @Query("SELECT COALESCE(SUM(s.grandTotal), 0) FROM SaleOrder s WHERE s.date = :date AND s.userId = :userId")
    BigDecimal sumGrandTotalByDateAndUserId(@Param("date") LocalDate date, @Param("userId") Long userId);
}
