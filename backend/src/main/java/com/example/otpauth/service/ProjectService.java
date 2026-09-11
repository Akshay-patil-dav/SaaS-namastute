package com.example.otpauth.service;

import com.example.otpauth.model.ProjectInvitation;
import com.example.otpauth.model.ProjectMember;
import com.example.otpauth.model.User;
import com.example.otpauth.repository.ProjectInvitationRepository;
import com.example.otpauth.repository.ProjectMemberRepository;
import com.example.otpauth.repository.UserRepository;
import com.example.otpauth.util.SecurityUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProjectService {

    private final ProjectInvitationRepository invitationRepository;
    private final ProjectMemberRepository memberRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectInvitationRepository invitationRepository,
                          ProjectMemberRepository memberRepository,
                          UserRepository userRepository) {
        this.invitationRepository = invitationRepository;
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
    }

    public ProjectInvitation inviteUser(String email, String permissions) {
        Long inviterId = SecurityUtils.getActualUserId();
        if (inviterId == null) throw new RuntimeException("Not authenticated");

        String token = UUID.randomUUID().toString();
        ProjectInvitation invitation = new ProjectInvitation(inviterId, email, permissions, token);
        return invitationRepository.save(invitation);
    }

    public List<ProjectInvitation> getPendingInvitationsForProject() {
        Long inviterId = SecurityUtils.getActualUserId();
        List<ProjectInvitation> invites = invitationRepository.findByInviterId(inviterId);
        invites.removeIf(i -> !i.getStatus().equals("PENDING"));
        return invites;
    }

    public void cancelInvitation(Long inviteId) {
        Long inviterId = SecurityUtils.getActualUserId();
        invitationRepository.findById(inviteId).ifPresent(inv -> {
            if (inv.getInviterId().equals(inviterId)) {
                invitationRepository.delete(inv);
            }
        });
    }

    public List<java.util.Map<String, Object>> getProjectMembers() {
        Long projectId = SecurityUtils.getActualUserId();
        if (projectId == null) return List.of();
        List<ProjectMember> members = memberRepository.findByProjectId(projectId);
        List<java.util.Map<String, Object>> result = new java.util.ArrayList<>();
        for (ProjectMember m : members) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", m.getId());
            map.put("memberUserId", m.getMemberUserId());
            map.put("permissions", m.getPermissions());
            userRepository.findById(m.getMemberUserId()).ifPresent(u -> {
                map.put("memberName", u.getFullName() != null ? u.getFullName() : u.getEmail());
                map.put("memberEmail", u.getEmail());
            });
            result.add(map);
        }
        return result;
    }

    public void updateMemberPermissions(Long memberId, String permissions) {
        Long projectId = SecurityUtils.getActualUserId();
        memberRepository.findById(memberId).ifPresent(member -> {
            if (member.getProjectId().equals(projectId)) {
                member.setPermissions(permissions);
                memberRepository.save(member);
            }
        });
    }

    public void removeMember(Long memberId) {
        Long projectId = SecurityUtils.getActualUserId();
        memberRepository.findById(memberId).ifPresent(member -> {
            if (member.getProjectId().equals(projectId)) {
                memberRepository.delete(member);
                // If the removed member has this project as active, reset it
                userRepository.findById(member.getMemberUserId()).ifPresent(user -> {
                    if (projectId.equals(user.getActiveProjectId())) {
                        user.setActiveProjectId(null);
                        userRepository.save(user);
                    }
                });
            }
        });
    }

    // --- Invitee actions ---

    public List<ProjectInvitation> getMyInvitations() {
        Long userId = SecurityUtils.getActualUserId();
        if (userId == null) return List.of();
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return List.of();

        List<ProjectInvitation> invites = invitationRepository.findByInviteeEmail(user.getEmail());
        invites.removeIf(i -> !i.getStatus().equals("PENDING"));
        return invites;
    }

    public boolean acceptInvitation(String token) {
        Long userId = SecurityUtils.getActualUserId();
        if (userId == null) return false;

        Optional<ProjectInvitation> invOpt = invitationRepository.findByToken(token);
        if (invOpt.isEmpty() || !invOpt.get().getStatus().equals("PENDING")) return false;

        ProjectInvitation inv = invOpt.get();
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || !user.getEmail().equalsIgnoreCase(inv.getInviteeEmail())) return false;

        inv.setStatus("ACCEPTED");
        invitationRepository.save(inv);

        ProjectMember member = new ProjectMember(inv.getInviterId(), userId, inv.getPermissions());
        memberRepository.save(member);

        // Automatically switch the user to this new project
        user.setActiveProjectId(inv.getInviterId());
        userRepository.save(user);

        return true;
    }

    public boolean rejectInvitation(String token) {
        Long userId = SecurityUtils.getActualUserId();
        if (userId == null) return false;

        Optional<ProjectInvitation> invOpt = invitationRepository.findByToken(token);
        if (invOpt.isEmpty() || !invOpt.get().getStatus().equals("PENDING")) return false;

        ProjectInvitation inv = invOpt.get();
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || !user.getEmail().equalsIgnoreCase(inv.getInviteeEmail())) return false;

        inv.setStatus("REJECTED");
        invitationRepository.save(inv);
        return true;
    }

    public List<java.util.Map<String, Object>> getAcceptedProjects() {
        Long userId = SecurityUtils.getActualUserId();
        if (userId == null) return List.of();
        List<ProjectMember> members = memberRepository.findByMemberUserId(userId);
        List<java.util.Map<String, Object>> result = new java.util.ArrayList<>();
        for (ProjectMember m : members) {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("projectId", m.getProjectId());
            map.put("permissions", m.getPermissions());
            userRepository.findById(m.getProjectId()).ifPresent(owner -> {
                map.put("ownerName", owner.getFullName() != null ? owner.getFullName() : owner.getEmail());
                map.put("ownerEmail", owner.getEmail());
            });
            result.add(map);
        }
        return result;
    }

    public void switchActiveProject(Long projectId) {
        Long userId = SecurityUtils.getActualUserId();
        if (userId == null) return;

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        if (projectId == null || projectId.equals(userId)) {
            user.setActiveProjectId(null); // Back to own project
            userRepository.save(user);
            return;
        }

        // Verify membership
        Optional<ProjectMember> memberOpt = memberRepository.findByProjectIdAndMemberUserId(projectId, userId);
        if (memberOpt.isPresent()) {
            user.setActiveProjectId(projectId);
            userRepository.save(user);
        } else {
            throw new RuntimeException("Not a member of this project");
        }
    }
}
