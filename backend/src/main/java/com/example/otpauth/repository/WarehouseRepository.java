package com.example.otpauth.repository;

import com.example.otpauth.model.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
    List<Warehouse> findByUserId(Long userId);
    List<Warehouse> findByUserIdOrderByIdDesc(Long userId);
}
