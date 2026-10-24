package com.example.otpauth.repository;

import com.example.otpauth.model.ContactSubmission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactSubmissionRepository extends JpaRepository<ContactSubmission, Long> {

    List<ContactSubmission> findAllByOrderByCreatedAtDesc();

    Page<ContactSubmission> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<ContactSubmission> findByStatusOrderByCreatedAtDesc(String status);

    Page<ContactSubmission> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    long countByStatus(String status);

    @Query("SELECT c FROM ContactSubmission c WHERE " +
           "(:status IS NULL OR :status = '' OR :status = 'ALL' OR UPPER(c.status) = UPPER(:status)) AND " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.phone) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.subject) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.message) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY c.createdAt DESC")
    Page<ContactSubmission> searchSubmissions(
            @Param("status") String status,
            @Param("search") String search,
            Pageable pageable
    );
}
