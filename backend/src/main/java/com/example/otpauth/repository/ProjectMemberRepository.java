package com.example.otpauth.repository;

import com.example.otpauth.model.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
    List<ProjectMember> findByProjectId(Long projectId);
    List<ProjectMember> findByMemberUserId(Long memberUserId);
    Optional<ProjectMember> findByProjectIdAndMemberUserId(Long projectId, Long memberUserId);
}
