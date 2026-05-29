package com.example.otpauth.repository;

import com.example.otpauth.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByUserId(Long userId);
    Optional<Product> findByIdAndUserId(Long id, Long userId);
    boolean existsByIdAndUserId(Long id, Long userId);

    boolean existsBySkuAndUserId(String sku, Long userId);
    boolean existsBySlugAndUserId(String slug, Long userId);
    Optional<Product> findBySkuAndUserId(String sku, Long userId);
    List<Product> findByExpiryDateBeforeAndUserId(LocalDate date, Long userId);
    int countByUnitAndUserId(String unit, Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT p FROM Product p WHERE p.userId = :userId AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.itemBarcode) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Product> searchProductsByUserId(@org.springframework.data.repository.query.Param("query") String query, @org.springframework.data.repository.query.Param("userId") Long userId);
}

