package com.elwaseet.backend.config;

import org.springframework.lang.NonNull;
import com.elwaseet.backend.entity.User;
import com.elwaseet.backend.entity.AdminUser;
import com.elwaseet.backend.repository.UserRepository;
import com.elwaseet.backend.repository.AdminUserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final AdminUserRepository adminUserRepository;

    public JwtAuthFilter(JwtUtil jwtUtil, UserRepository userRepository, AdminUserRepository adminUserRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.adminUserRepository = adminUserRepository;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String role = jwtUtil.extractRole(token);

                if ("ADMIN".equals(role)) {
                    // Admin token - subject is email
                    String email = jwtUtil.extractEmail(token);
                    AdminUser admin = adminUserRepository.findByEmail(email).orElse(null);

                    if (admin != null && admin.getIsActive()) {
                        var authorities = List.of(new SimpleGrantedAuthority("ROLE_ADMIN")); 
                        var authentication = new UsernamePasswordAuthenticationToken(admin, null, authorities);
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                } else {
                    // User token - subject is userId
                    long userId = jwtUtil.extractUserId(token);
                    User user = userRepository.findById(userId).orElse(null);

                    if (user != null && user.isActive() && !user.isBanned()) {
                        var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getAccountType()));
                        var authentication = new UsernamePasswordAuthenticationToken(user, null, authorities);
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            } catch (Exception e) {
                // invalid/expired token → leave unauthenticated
            }
        }

        filterChain.doFilter(request, response);
    }
}