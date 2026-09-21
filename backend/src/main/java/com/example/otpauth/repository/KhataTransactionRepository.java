package com.example.otpauth.repository;

import com.example.otpauth.model.KhataTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface KhataTransactionRepository extends JpaRepository<KhataTransaction, Long> {

    List<KhataTransaction> findByUserIdAndPartyIdOrderByTransactionDateDescCreatedAtDesc(Long userId, Long partyId);

    List<KhataTransaction> findByUserIdAndPartyIdOrderByTransactionDateAscCreatedAtAsc(Long userId, Long partyId);

    List<KhataTransaction> findByUserIdOrderByTransactionDateDescCreatedAtDesc(Long userId);

    List<KhataTransaction> findByUserIdAndTransactionDateOrderByCreatedAtDesc(Long userId, LocalDate date);

    Optional<KhataTransaction> findByIdAndUserId(Long id, Long userId);

    void deleteByPartyIdAndUserId(Long partyId, Long userId);

    @Query("SELECT t FROM KhataTransaction t WHERE t.userId = :userId AND " +
           "(:partyId IS NULL OR t.partyId = :partyId) AND " +
           "(:fromDate IS NULL OR t.transactionDate >= :fromDate) AND " +
           "(:toDate IS NULL OR t.transactionDate <= :toDate) " +
           "ORDER BY t.transactionDate DESC, t.createdAt DESC")
    List<KhataTransaction> filterTransactions(@Param("userId") Long userId,
                                              @Param("partyId") Long partyId,
                                              @Param("fromDate") LocalDate fromDate,
                                              @Param("toDate") LocalDate toDate);
}
