package com.example.otpauth.repository;

import com.example.otpauth.model.StockTransfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockTransferRepository extends JpaRepository<StockTransfer, Long> {
}
