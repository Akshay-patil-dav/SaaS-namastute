package com.example.otpauth.repository;

import com.example.otpauth.model.SalesReturn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalesReturnRepository extends JpaRepository<SalesReturn, Long> {

    List<SalesReturn> findAllByOrderByCreatedAtDesc();

    @Query("SELECT s FROM SalesReturn s WHERE " +
           "LOWER(s.customerName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.referenceNo)  LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.status)       LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.paymentStatus) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.biller)       LIKE LOWER(CONCAT('%', :q, '%'))")
    List<SalesReturn> searchReturns(@Param("q") String q);
}
