package com.example.otpauth.repository;

import com.example.otpauth.model.FolderInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FolderInvitationRepository extends JpaRepository<FolderInvitation, Long> {
    Optional<FolderInvitation> findByToken(String token);
    
    java.util.List<FolderInvitation> findByEmailAndStatus(String email, String status);

    Optional<FolderInvitation> findByIdAndEmail(Long id, String email);
}
