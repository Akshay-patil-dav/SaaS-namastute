package com.example.otpauth.repository;

import com.example.otpauth.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsBySku(String sku);
    boolean existsBySlug(String slug);
    Optional<Product> findBySku(String sku);
    List<Product> findByExpiryDateBefore(LocalDate date);
    int countByUnit(String unit);
}
