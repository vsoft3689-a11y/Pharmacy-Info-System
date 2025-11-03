//package com.pharmacy.PharmacyInfoSystem.config;
//
//import io.jsonwebtoken.*;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Component;
//import java.util.Date;
//
//
//@Component
//public class JwtUtil {
//
//
//    @Value("${app.jwt.secret}")
//    private String jwtSecret;
//
//
//    @Value("${app.jwt.expiration-ms}")
//    private Long jwtExpirationMs;
//
//
//    public String generateToken(String username) {
//        Date now = new Date();
//        Date expiry = new Date(now.getTime() + jwtExpirationMs);
//        return Jwts.builder()
//                .setSubject(username)
//                .setIssuedAt(now)
//                .setExpiration(expiry)
//                .signWith(SignatureAlgorithm.HS512, jwtSecret)
//                .compact();
//    }
//
//
//    public String getUsernameFromToken(String token) {
//        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
//    }
//
//
//public String generateToken(String username, String role) {
//    return Jwts.builder()
//            .setSubject(username)
//            .claim("role", role)
//            .setIssuedAt(new Date())
//            .setExpiration(new Date(System.currentTimeMillis() + 86400000))
//            .signWith(SignatureAlgorithm.HS512, secret)
//            .compact();
//}
//
//public String extractRole(String token) {
//    return extractAllClaims(token).get("role", String.class);
//}
//private Claims getClaims(String token) {
//    return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
//}
//

//public String getUsernameFromToken(String token) { return getClaims(token).getSubject(); }
//public String getRoleFromToken(String token) { return getClaims(token).get("role", String.class); }
//public boolean validateToken(String token) { try { getClaims(token); return true; } catch (JwtException | IllegalArgumentException ex) { return false; } }
//}
//
//    public boolean validateToken(String token) {
//        try {
//            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
//            return true;
//        } catch (JwtException | IllegalArgumentException ex) {
//            return false;
//        }
//    }
//}
