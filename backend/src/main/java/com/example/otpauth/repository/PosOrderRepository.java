package com.example.otpauth.repository;

import com.example.otpauth.model.PosOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PosOrderRepository extends JpaRepository<PosOrder, Long> {
    List<PosOrder> findByUserId(Long userId);
    java.util.Optional<PosOrder> findByIdAndUserId(Long id, Long userId);
    boolean existsByIdAndUserId(Long id, Long userId);

    List<PosOrder> findAllByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT p FROM PosOrder p WHERE p.userId = :userId AND (" +
           "LOWER(p.customerName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(p.referenceNo) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(p.status) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(p.paymentStatus) LIKE LOWER(CONCAT('%', :q, '%')))")
    List<PosOrder> searchOrdersByUserId(@Param("q") String q, @Param("userId") Long userId);

    /** Count all POS orders whose date equals the given date (today). */
    long countByDateAndUserId(LocalDate date, Long userId);

    /** Sum grandTotal for all POS orders on a given date (returns 0 if none). */
    @Query("SELECT COALESCE(SUM(p.grandTotal), 0) FROM PosOrder p WHERE p.date = :date AND p.userId = :userId")
    BigDecimal sumGrandTotalByDateAndUserId(@Param("date") LocalDate date, @Param("userId") Long userId);

    /** Sum grandTotal for all POS orders (returns 0 if none). */
    @Query("SELECT COALESCE(SUM(p.grandTotal), 0) FROM PosOrder p WHERE p.userId = :userId")
    BigDecimal sumGrandTotalByUserId(@Param("userId") Long userId);

    long countByUserId(Long userId);
}
