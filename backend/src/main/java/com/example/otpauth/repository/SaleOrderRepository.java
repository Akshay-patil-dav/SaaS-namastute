package com.example.otpauth.repository;

import com.example.otpauth.model.SaleOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaleOrderRepository extends JpaRepository<SaleOrder, Long> {

    List<SaleOrder> findAllByOrderByCreatedAtDesc();

    @Query("SELECT s FROM SaleOrder s WHERE " +
           "LOWER(s.customerName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.referenceNo) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.status) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.paymentStatus) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<SaleOrder> searchOrders(@Param("q") String q);
}
