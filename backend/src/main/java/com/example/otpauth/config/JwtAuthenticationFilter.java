package com.example.otpauth.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String identifier;

        // Also support ?token=<jwt> query param for SSE connections (EventSource cannot set headers)
        String tokenFromHeader = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            tokenFromHeader = authHeader.substring(7).trim();
        } else if (request.getParameter("token") != null) {
            tokenFromHeader = request.getParameter("token").trim();
        }

        if (tokenFromHeader == null || tokenFromHeader.isEmpty() 
                || "null".equalsIgnoreCase(tokenFromHeader) 
                || "undefined".equalsIgnoreCase(tokenFromHeader)) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = tokenFromHeader;
        try {
            identifier = jwtUtil.extractUsername(jwt);
            if (identifier != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(identifier);
                if (jwtUtil.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Token is invalid/expired, log at debug level and let filter chain handle authorization
            logger.debug("Authentication error: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
