package com.example.otpauth.repository;

import com.example.otpauth.model.SubscriptionTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionTransactionRepository extends JpaRepository<SubscriptionTransaction, Long> {
    List<SubscriptionTransaction> findByUserEmailOrderByTransactionDateDesc(String userEmail);
}
