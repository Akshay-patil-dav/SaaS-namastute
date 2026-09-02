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

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository,
            PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager,
            JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
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

        List<String> roles = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toList());
        String planStr = user.getPlan() != null ? user.getPlan().name()
                : com.example.otpauth.model.SubscriptionPlan.NONE.name();
        return new AuthResponse(token, user.getEmail(), user.getFullName(), roles, planStr, user.isEmailVerified(),
                user.isPhoneVerified());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetailsImpl userDetails = new UserDetailsImpl(user);
        String token = jwtUtil.generateToken(userDetails);

        List<String> roles = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toList());
        String planStr = user.getPlan() != null ? user.getPlan().name()
                : com.example.otpauth.model.SubscriptionPlan.NONE.name();
        return new AuthResponse(token, user.getEmail(), user.getFullName(), roles, planStr, user.isEmailVerified(),
                user.isPhoneVerified());
    }

    @Transactional
    public AuthResponse googleLogin(String credential) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(),
                    new GsonFactory())
                    .setAudience(Collections
                            .singletonList("167861187519-tad34cb9ben048eb4ddfbf70h4plhj91.apps.googleusercontent.com"))
                    .build();

            GoogleIdToken idToken = verifier.verify(credential);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");

                User user = userRepository.findByEmail(email).orElse(null);
                if (user == null) {
                    user = new User(
                            email,
                            passwordEncoder.encode(UUID.randomUUID().toString()),
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

                List<String> roles = user.getRoles().stream()
                        .map(r -> r.getName().name())
                        .collect(Collectors.toList());
                String planStr = user.getPlan() != null ? user.getPlan().name()
                        : com.example.otpauth.model.SubscriptionPlan.NONE.name();
                return new AuthResponse(token, user.getEmail(), user.getFullName(), roles, planStr,
                        user.isEmailVerified(), user.isPhoneVerified());
            } else {
                throw new RuntimeException("Invalid Google ID token.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Google authentication failed: " + e.getMessage());
        }
    }
}
