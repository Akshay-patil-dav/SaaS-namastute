package com.example.otpauth.repository;

import com.example.otpauth.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    java.util.List<Customer> findByUserId(Long userId);
    java.util.Optional<Customer> findByIdAndUserId(Long id, Long userId);
    boolean existsByIdAndUserId(Long id, Long userId);
}
