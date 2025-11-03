//package com.pharmacy.PharmacyInfoSystem.config;
//
//import com.pharmacy.PharmacyInfoSystem.entity.User;
//import com.pharmacy.PharmacyInfoSystem.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpHeaders;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import java.io.IOException;
//import java.util.List;
//
//
//@Component
//public class JwtAuthFilter extends OncePerRequestFilter {
//
//
//    @Autowired
//    private JwtUtil jwtUtil;
//
//
//    @Autowired
//    private UserRepository userRepository;
//
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
//        if (header != null && header.startsWith("Bearer ")) {
//            String token = header.substring(7);
//            if (jwtUtil.validateToken(token)) {
//                String username = jwtUtil.getUsernameFromToken(token);
//                User user = userRepository.findByUsername(username).orElse(null);
//                if (user != null) {
//                    var auth = new UsernamePasswordAuthenticationToken(username, null, List.of(new SimpleGrantedAuthority(user.getRole())));
//                    SecurityContextHolder.getContext().setAuthentication(auth);
//                }
//            }
//        }
//        filterChain.doFilter(request, response);
//    }


//@Autowired
//private JwtUtil jwtUtil;
//
//
//@Override
//protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//    String header = request.getHeader(HttpHeaders.AUTHORIZATION);
//    if (header != null && header.startsWith("Bearer ")) {
//        String token = header.substring(7);
//        if (jwtUtil.validateToken(token)) {
//            String username = jwtUtil.getUsernameFromToken(token);
//            String role = jwtUtil.getRoleFromToken(token);
//            var auth = new UsernamePasswordAuthenticationToken(username, null, List.of(new SimpleGrantedAuthority(role)));
//            SecurityContextHolder.getContext().setAuthentication(auth);
//        }
//    }
//    filterChain.doFilter(request, response);
//}
//}
