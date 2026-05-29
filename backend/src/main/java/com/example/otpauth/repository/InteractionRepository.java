package com.example.otpauth.repository;

import com.example.otpauth.model.Interaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InteractionRepository extends JpaRepository<Interaction, Long> {
    List<Interaction> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
}
