package com.example.otpauth.repository;

import com.example.otpauth.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    List<Stock> findByUserId(Long userId);
    java.util.Optional<Stock> findByIdAndUserId(Long id, Long userId);
    boolean existsByIdAndUserId(Long id, Long userId);

    List<Stock> findAllByUserIdOrderByCreatedAtDesc(Long userId);
}
