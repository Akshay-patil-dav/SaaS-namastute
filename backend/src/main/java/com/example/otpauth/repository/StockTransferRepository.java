package com.example.otpauth.repository;

import com.example.otpauth.model.StockTransfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockTransferRepository extends JpaRepository<StockTransfer, Long> {
    java.util.List<StockTransfer> findByUserId(Long userId);
    java.util.Optional<StockTransfer> findByIdAndUserId(Long id, Long userId);
    boolean existsByIdAndUserId(Long id, Long userId);
}
