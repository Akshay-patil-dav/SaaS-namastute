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

    List<PosOrder> findAllByOrderByCreatedAtDesc();

    @Query("SELECT p FROM PosOrder p WHERE " +
           "LOWER(p.customerName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(p.referenceNo) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(p.status) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(p.paymentStatus) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<PosOrder> searchOrders(@Param("q") String q);

    /** Count all POS orders whose date equals the given date (today). */
    long countByDate(LocalDate date);

    /** Sum grandTotal for all POS orders on a given date (returns 0 if none). */
    @Query("SELECT COALESCE(SUM(p.grandTotal), 0) FROM PosOrder p WHERE p.date = :date")
    BigDecimal sumGrandTotalByDate(@Param("date") LocalDate date);
}
