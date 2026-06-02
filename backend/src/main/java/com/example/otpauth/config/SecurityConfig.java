package com.example.otpauth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2AuthenticationSuccessHandler successHandler;

    // ─── Read from backend/.env → FRONTEND_URL ────────────────────────────────
    // This is the primary allowed CORS origin (your frontend URL)
    @Value("${app.frontend-url}")
    private String frontendUrl;

    // ─── Read from backend/.env → CORS_EXTRA_ORIGINS ──────────────────────────
    // Optional: comma-separated extra origins (e.g. for dev ports, staging, etc.)
    // Example: CORS_EXTRA_ORIGINS=http://localhost:5174,http://localhost:3000
    @Value("${app.cors-extra-origins:}")
    private String corsExtraOrigins;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter,
                          CustomOAuth2UserService customOAuth2UserService,
                          OAuth2AuthenticationSuccessHandler successHandler) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.customOAuth2UserService = customOAuth2UserService;
        this.successHandler = successHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/oauth2/**", "/login/**", "/api/upload/**", "/uploads/**", "/api/categories", "/api/subcategories", "/api/brands", "/api/units", "/api/warranties").permitAll()
                        // AI Helper endpoints require a valid JWT — each user can only access their own data
                        .requestMatchers("/api/ai/**").authenticated()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(e -> e
                        .defaultAuthenticationEntryPointFor(
                                (request, response, authException) -> {
                                    response.setStatus(401);
                                    response.setContentType("application/json");
                                    response.getWriter().write("{\"error\": \"Unauthorized\"}");
                                },
                                new org.springframework.security.web.util.matcher.AntPathRequestMatcher("/api/**")
                        )
                )
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService)
                        )
                        .successHandler(successHandler)
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // ── CORS Allowed Origins ───────────────────────────────────────────────────
        // ALL origins come from backend/.env via application.yml — zero hardcoding here.
        //
        //  backend/.env:
        //    FRONTEND_URL=http://localhost:5173        ← your main allowed origin
        //    CORS_EXTRA_ORIGINS=http://localhost:5174,https://saa-s-namastute.vercel.app
        //
        List<String> origins = new java.util.ArrayList<>();

        // Strip trailing slash so "http://localhost:5173/" and "http://localhost:5173"
        // both resolve to the same origin, preventing subtle CORS mismatches.
        String primary = frontendUrl.endsWith("/") ? frontendUrl.substring(0, frontendUrl.length() - 1) : frontendUrl;
        origins.add(primary);

        if (corsExtraOrigins != null && !corsExtraOrigins.isBlank()) {
            for (String o : corsExtraOrigins.split(",")) {
                String trimmed = o.trim();
                if (trimmed.endsWith("/")) trimmed = trimmed.substring(0, trimmed.length() - 1);
                if (!trimmed.isEmpty() && !origins.contains(trimmed)) origins.add(trimmed);
            }
        }
        configuration.setAllowedOrigins(origins);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "X-Requested-With"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // cache preflight for 1 hour
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
