package com.example.otpauth.service;

import com.example.otpauth.model.ProjectInvitation;
import com.example.otpauth.model.ProjectMember;
import com.example.otpauth.model.User;
import com.example.otpauth.repository.ProjectInvitationRepository;
import com.example.otpauth.repository.ProjectMemberRepository;
import com.example.otpauth.repository.UserRepository;
import com.example.otpauth.util.SecurityUtils;
import com.example.otpauth.dto.StaffRequest;
import com.example.otpauth.model.Role;
import com.example.otpauth.model.RoleName;
import com.example.otpauth.repository.RoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProjectService {

    private final ProjectInvitationRepository invitationRepository;
    private final ProjectMemberRepository memberRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public ProjectService(ProjectInvitationRepository invitationRepository,
                          ProjectMemberRepository memberRepository,
                          UserRepository userRepository,
                          RoleRepository roleRepository,
                          PasswordEncoder passwordEncoder) {
        this.invitationRepository = invitationRepository;
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
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

    public java.util.Map<String, Object> createStaffMember(StaffRequest request) {
        Long ownerId = SecurityUtils.getActualUserId();
        if (ownerId == null) throw new RuntimeException("Not authenticated");

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Email address is required");
        }
        String email = request.getEmail().trim().toLowerCase();

        if (request.getPassword() == null || request.getPassword().trim().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters long");
        }

        String fullName = request.getFullName();
        if (fullName == null || fullName.isBlank()) {
            fullName = request.getName();
        }
        if (fullName == null || fullName.isBlank()) {
            fullName = email.contains("@") ? email.substring(0, email.indexOf('@')) : email;
        } else {
            fullName = fullName.trim();
        }

        String roleTitle = request.getRoleTitle();
        if (roleTitle == null || roleTitle.isBlank()) {
            roleTitle = "Staff";
        } else {
            roleTitle = roleTitle.trim();
        }

        String permissions = request.getPermissions();
        if (permissions == null || permissions.isBlank()) {
            permissions = "{}";
        }

        Optional<User> existingUserOpt = userRepository.findByEmail(email);
        User staffUser;
        if (existingUserOpt.isPresent()) {
            staffUser = existingUserOpt.get();
            Optional<ProjectMember> existingMember = memberRepository.findByProjectIdAndMemberUserId(ownerId, staffUser.getId());
            if (existingMember.isPresent()) {
                throw new RuntimeException("User with this email is already a member of your workspace.");
            }
            if (staffUser.getActiveProjectId() == null) {
                staffUser.setActiveProjectId(ownerId);
                userRepository.save(staffUser);
            }
        } else {
            staffUser = new User();
            staffUser.setEmail(email);
            staffUser.setUsername(email);
            staffUser.setPassword(passwordEncoder.encode(request.getPassword().trim()));
            staffUser.setFullName(fullName);
            staffUser.setPhoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : null);
            staffUser.setBusinessType(owner.getBusinessType());
            staffUser.setEmailVerified(true);
            staffUser.setPhoneVerified(true);
            staffUser.setActiveProjectId(ownerId);
            staffUser.setPlan(owner.getPlan());
            staffUser.setSubscriptionEndDate(owner.getSubscriptionEndDate());

            Role clientRole = roleRepository.findByName(RoleName.CLIENT).orElseGet(() -> roleRepository.save(new Role(RoleName.CLIENT)));
            staffUser.setRoles(new java.util.HashSet<>(List.of(clientRole)));
            staffUser = userRepository.save(staffUser);
        }

        ProjectMember member = new ProjectMember(ownerId, staffUser.getId(), permissions, roleTitle, "ACTIVE");
        member = memberRepository.save(member);

        java.util.Map<String, Object> map = new java.util.HashMap<>();
        map.put("id", member.getId());
        map.put("memberUserId", staffUser.getId());
        map.put("memberName", staffUser.getFullName());
        map.put("name", staffUser.getFullName());
        map.put("memberEmail", staffUser.getEmail());
        map.put("email", staffUser.getEmail());
        map.put("phoneNumber", staffUser.getPhoneNumber());
        map.put("roleTitle", member.getRoleTitle());
        map.put("status", member.getStatus());
        map.put("permissions", member.getPermissions());
        map.put("joinedAt", member.getJoinedAt());
        return map;
    }

    public java.util.Map<String, Object> updateStaffMember(Long memberId, StaffRequest request) {
        Long ownerId = SecurityUtils.getActualUserId();
        if (ownerId == null) throw new RuntimeException("Not authenticated");

        ProjectMember member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if (!member.getProjectId().equals(ownerId)) {
            throw new RuntimeException("You do not have permission to manage this member");
        }

        if (request.getPermissions() != null) {
            member.setPermissions(request.getPermissions());
        }
        if (request.getRoleTitle() != null && !request.getRoleTitle().isBlank()) {
            member.setRoleTitle(request.getRoleTitle().trim());
        }
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            member.setStatus(request.getStatus().trim().toUpperCase());
        }
        member = memberRepository.save(member);

        User user = userRepository.findById(member.getMemberUserId()).orElse(null);
        if (user != null) {
            boolean userUpdated = false;
            if (request.getFullName() != null && !request.getFullName().isBlank()) {
                user.setFullName(request.getFullName().trim());
                userUpdated = true;
            }
            if (request.getPhoneNumber() != null) {
                user.setPhoneNumber(request.getPhoneNumber().trim());
                userUpdated = true;
            }
            if (request.getPassword() != null && !request.getPassword().trim().isBlank()) {
                if (request.getPassword().trim().length() < 6) {
                    throw new RuntimeException("New password must be at least 6 characters long");
                }
                user.setPassword(passwordEncoder.encode(request.getPassword().trim()));
                userUpdated = true;
            }
            if (userUpdated) {
                userRepository.save(user);
            }
        }

        java.util.Map<String, Object> map = new java.util.HashMap<>();
        map.put("id", member.getId());
        map.put("memberUserId", member.getMemberUserId());
        map.put("roleTitle", member.getRoleTitle());
        map.put("status", member.getStatus());
        map.put("permissions", member.getPermissions());
        map.put("joinedAt", member.getJoinedAt());
        if (user != null) {
            map.put("memberName", user.getFullName());
            map.put("name", user.getFullName());
            map.put("memberEmail", user.getEmail());
            map.put("email", user.getEmail());
            map.put("phoneNumber", user.getPhoneNumber());
        }
        return map;
    }

    public java.util.Map<String, Object> toggleMemberStatus(Long memberId) {
        Long ownerId = SecurityUtils.getActualUserId();
        if (ownerId == null) throw new RuntimeException("Not authenticated");

        ProjectMember member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if (!member.getProjectId().equals(ownerId)) {
            throw new RuntimeException("You do not have permission to manage this member");
        }

        String newStatus = "ACTIVE".equalsIgnoreCase(member.getStatus()) ? "INACTIVE" : "ACTIVE";
        member.setStatus(newStatus);
        member = memberRepository.save(member);

        return java.util.Map.of("id", member.getId(), "status", newStatus);
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
            map.put("roleTitle", m.getRoleTitle() != null ? m.getRoleTitle() : "Staff");
            map.put("status", m.getStatus() != null ? m.getStatus() : "ACTIVE");
            map.put("permissions", m.getPermissions());
            map.put("joinedAt", m.getJoinedAt());
            userRepository.findById(m.getMemberUserId()).ifPresent(u -> {
                String displayName = u.getFullName() != null && !u.getFullName().isBlank() ? u.getFullName() : u.getEmail();
                map.put("memberName", displayName);
                map.put("name", displayName);
                map.put("memberEmail", u.getEmail());
                map.put("email", u.getEmail());
                map.put("phoneNumber", u.getPhoneNumber());
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
        if (invOpt.isEmpty() || !"PENDING".equalsIgnoreCase(invOpt.get().getStatus())) return false;

        ProjectInvitation inv = invOpt.get();
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || !user.getEmail().equalsIgnoreCase(inv.getInviteeEmail())) return false;

        inv.setStatus("ACCEPTED");
        invitationRepository.save(inv);

        Optional<ProjectMember> existingMemberOpt = memberRepository.findByProjectIdAndMemberUserId(inv.getInviterId(), userId);
        ProjectMember member;
        if (existingMemberOpt.isPresent()) {
            member = existingMemberOpt.get();
            member.setPermissions(inv.getPermissions());
            member.setStatus("ACTIVE");
        } else {
            member = new ProjectMember(inv.getInviterId(), userId, inv.getPermissions(), "Staff", "ACTIVE");
        }
        memberRepository.save(member);

        // Automatically switch the user to this new workspace project
        user.setActiveProjectId(inv.getInviterId());

        // Inherit workspace owner's plan and business type to avoid free-tier limit issues for staff
        User owner = userRepository.findById(inv.getInviterId()).orElse(null);
        if (owner != null) {
            user.setPlan(owner.getPlan());
            user.setSubscriptionEndDate(owner.getSubscriptionEndDate());
            if (owner.getBusinessType() != null && !owner.getBusinessType().isBlank()) {
                user.setBusinessType(owner.getBusinessType());
            }
        }
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
