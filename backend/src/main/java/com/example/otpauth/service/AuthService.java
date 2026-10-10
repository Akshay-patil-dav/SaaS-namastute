package com.example.otpauth.service;

import com.example.otpauth.config.JwtUtil;
import com.example.otpauth.config.UserDetailsImpl;
import com.example.otpauth.dto.AuthResponse;
import com.example.otpauth.dto.LoginRequest;
import com.example.otpauth.dto.RegisterRequest;
import com.example.otpauth.model.Role;
import com.example.otpauth.model.RoleName;
import com.example.otpauth.model.User;
import com.example.otpauth.repository.RoleRepository;
import com.example.otpauth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import java.util.Collections;
import java.util.UUID;

@Service
public class AuthService {

    @Value("${spring.security.oauth2.client.registration.google.client-id:167861187519-tad34cb9ben048eb4ddfbf70h4plhj91.apps.googleusercontent.com}")
    private String googleClientId;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final com.example.otpauth.repository.ProjectMemberRepository memberRepository;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository,
            PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager,
            JwtUtil jwtUtil, com.example.otpauth.repository.ProjectMemberRepository memberRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.memberRepository = memberRepository;
    }

    private static final java.util.Set<String> DISPOSABLE_DOMAINS = java.util.Set.of(
            "oineprovi.com", "yopmail.com", "mailinator.com", "guerrillamail.com",
            "10minutemail.com", "temp-mail.org", "throwawaymail.com", "maildrop.cc",
            "trashmail.com", "sharklasers.com", "dispostable.com");

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase();
        String domain = email.substring(email.indexOf("@") + 1);

        if (DISPOSABLE_DOMAINS.contains(domain)) {
            throw new RuntimeException(
                    "Disposable emails are not permitted. Please use a valid business or personal email.");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered");
        }

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());

        Role defaultRole = roleRepository.findByName(RoleName.CLIENT).orElseGet(() -> {
            Role newRole = new Role(RoleName.CLIENT);
            return roleRepository.save(newRole);
        });
        user.getRoles().add(defaultRole);
        userRepository.save(user);

        UserDetailsImpl userDetails = new UserDetailsImpl(user);
        String token = jwtUtil.generateToken(userDetails);

        return createAuthResponse(user, token);
    }

    public AuthResponse login(LoginRequest request) {
        // authenticate() internally calls UserDetailsServiceImpl.loadUserByUsername()
        // which already fetches the User from DB — so we extract it from the principal
        // directly rather than issuing a second findByEmail() query.
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userDetails.getUser();

        String token = jwtUtil.generateToken(userDetails);

        return createAuthResponse(user, token);
    }

    @Transactional
    public AuthResponse googleLogin(String credential) {
        try {
            String targetClientId = (googleClientId != null && !googleClientId.isBlank() && !googleClientId.startsWith("YOUR_"))
                    ? googleClientId
                    : "167861187519-tad34cb9ben048eb4ddfbf70h4plhj91.apps.googleusercontent.com";

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(),
                    new GsonFactory())
                    .setAudience(Collections.singletonList(targetClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(credential);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");

                User user = userRepository.findByEmail(email).orElse(null);
                if (user == null) {
                    // Generate a cryptographically unique random password for OAuth users.
                    // Each call to UUID.randomUUID() uses SecureRandom internally, so every
                    // user gets a distinct random value. BCrypt then adds its own random salt
                    // on top, guaranteeing the stored hash is unique in the DB as well.
                    String uniqueRawPassword = UUID.randomUUID().toString() + "-" + UUID.randomUUID().toString();
                    user = new User(
                            email,
                            passwordEncoder.encode(uniqueRawPassword),
                            name);
                    user.setEmailVerified(true);

                    Role defaultRole = roleRepository.findByName(RoleName.CLIENT).orElseGet(() -> {
                        Role newRole = new Role(RoleName.CLIENT);
                        return roleRepository.save(newRole);
                    });
                    user.getRoles().add(defaultRole);
                    user = userRepository.save(user);
                }

                UserDetailsImpl userDetails = new UserDetailsImpl(user);
                String token = jwtUtil.generateToken(userDetails);

                return createAuthResponse(user, token);
            } else {
                throw new RuntimeException("Invalid Google ID token.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Google authentication failed: " + e.getMessage());
        }
    }

    @Transactional
    public AuthResponse completeOnboarding(com.example.otpauth.dto.OnboardingRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (userRepository.existsByUsername(request.getUsername()) &&
                (user.getUsername() == null || !user.getUsername().equals(request.getUsername()))) {
            throw new RuntimeException("Username is already taken");
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setUsername(request.getUsername());
        user.setBusinessType(request.getBusinessType());
        // Also update fullName for backward compatibility if needed
        if (request.getFirstName() != null && request.getLastName() != null) {
            user.setFullName(request.getFirstName() + " " + request.getLastName());
        }

        userRepository.save(user);

        UserDetailsImpl userDetails = new UserDetailsImpl(user);
        String token = jwtUtil.generateToken(userDetails); // Optional: regenerate token if claims change

        return createAuthResponse(user, token);
    }

    /**
     * Updates only the businessType field for the authenticated user.
     * Does NOT touch firstName, lastName, username — safe to call at any time.
     */
    @Transactional
    public AuthResponse updateBusinessType(String businessType, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (businessType == null || businessType.isBlank()) {
            throw new RuntimeException("Business type cannot be empty");
        }

        user.setBusinessType(businessType);
        userRepository.save(user);

        // Re-issue token so any JWT claims stay fresh
        UserDetailsImpl userDetails = new UserDetailsImpl(user);
        String token = jwtUtil.generateToken(userDetails);

        return createAuthResponse(user, token);
    }

    public java.util.Map<String, Object> checkUsername(String username) {
        boolean exists = userRepository.existsByUsername(username);
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("available", !exists);
        if (exists) {
            java.util.List<String> suggestions = new java.util.ArrayList<>();
            int count = 1;
            while (suggestions.size() < 3) {
                String suggestion = username + count;
                if (!userRepository.existsByUsername(suggestion)) {
                    suggestions.add(suggestion);
                }
                count++;
            }
            response.put("suggestions", suggestions);
        }
        return response;
    }

    public boolean promoteQueuedPlanIfExpired(User user) {
        if (user == null || user.getNextPlan() == null) return false;
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        if (user.getSubscriptionEndDate() == null || now.isAfter(user.getSubscriptionEndDate())) {
            java.time.LocalDateTime newEndDate = user.getNextSubscriptionEndDate();
            if (newEndDate == null || newEndDate.isBefore(now)) {
                int queuedDays = (user.getNextSubscriptionDays() != null && user.getNextSubscriptionDays() > 0)
                        ? user.getNextSubscriptionDays() : 30;
                newEndDate = now.plusDays(queuedDays);
            }
            user.setPlan(user.getNextPlan());
            user.setSubscriptionEndDate(newEndDate);
            user.setNextPlan(null);
            user.setNextSubscriptionEndDate(null);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    @org.springframework.scheduling.annotation.Scheduled(fixedDelay = 60000)
    public void autoPromoteExpiredQueuedSubscriptions() {
        try {
            List<User> queuedUsers = userRepository.findByNextPlanIsNotNull();
            for (User u : queuedUsers) {
                promoteQueuedPlanIfExpired(u);
            }
        } catch (Exception ignored) {
        }
    }

    private AuthResponse createAuthResponse(User user, String token) {
        // Automatically promote queued plan if active plan has expired
        promoteQueuedPlanIfExpired(user);

        List<String> roles = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toList());
        String planStr = user.getPlan() != null ? user.getPlan().name()
                : com.example.otpauth.model.SubscriptionPlan.NONE.name();

        Long activeProjectId = user.getActiveProjectId();
        String permissions = null;
        if (activeProjectId != null && !activeProjectId.equals(user.getId())) {
            permissions = memberRepository.findByProjectIdAndMemberUserId(activeProjectId, user.getId())
                    .map(com.example.otpauth.model.ProjectMember::getPermissions)
                    .orElse(null);
        }

        String nextPlanStr = user.getNextPlan() != null ? user.getNextPlan().name() : null;
        Integer nextDays = user.getNextSubscriptionDays(); // derived from nextSubscriptionEndDate

        return new AuthResponse(user.getId(), token, user.getEmail(), user.getFullName(), user.getFirstName(),
                user.getLastName(), user.getUsername(), user.getBusinessType(), roles, planStr, user.isEmailVerified(),
                user.isPhoneVerified(), activeProjectId, permissions, user.getSubscriptionEndDate(), nextPlanStr, nextDays);
    }

    public AuthResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        // Token isn't re-issued on /me, frontend keeps the old one. We return empty
        // string or null.
        return createAuthResponse(user, null);
    }
}
