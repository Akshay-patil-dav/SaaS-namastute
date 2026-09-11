package com.example.otpauth.repository;

import com.example.otpauth.model.ProjectInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectInvitationRepository extends JpaRepository<ProjectInvitation, Long> {
    List<ProjectInvitation> findByInviterId(Long inviterId);
    List<ProjectInvitation> findByInviteeEmail(String inviteeEmail);
    Optional<ProjectInvitation> findByToken(String token);
}
