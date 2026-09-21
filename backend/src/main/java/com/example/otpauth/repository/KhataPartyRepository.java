package com.example.otpauth.repository;

import com.example.otpauth.model.KhataParty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KhataPartyRepository extends JpaRepository<KhataParty, Long> {

    List<KhataParty> findByUserIdOrderByUpdatedAtDesc(Long userId);

    List<KhataParty> findByUserIdAndPartyTypeOrderByUpdatedAtDesc(Long userId, String partyType);

    Optional<KhataParty> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT p FROM KhataParty p WHERE p.userId = :userId AND " +
           "(:partyType IS NULL OR p.partyType = :partyType) AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.phone) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<KhataParty> searchParties(@Param("userId") Long userId,
                                   @Param("partyType") String partyType,
                                   @Param("query") String query);

    long countByUserIdAndPartyType(Long userId, String partyType);
}
