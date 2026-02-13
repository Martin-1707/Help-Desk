package com.presentacion.helpdesk.securities;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenUtil {
    @Value("${jwt.secret}") // Ideal: Base64 de una key >= 32 bytes
    private String secretBase64;

    @Value("${jwt.exp-ms:18000000}") // 5 horas por defecto
    private long jwtValidityMs;

    private SecretKey getSigningKey() {
        // secretBase64 debe ser Base64. Si quieres usar texto plano, dime y lo adapto.
        byte[] keyBytes = java.util.Base64.getDecoder().decode(secretBase64);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    public Date getExpirationDateFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getExpiration();
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", userDetails.getAuthorities().stream()
                .map(a -> a.getAuthority()).toList());

        Date now = new Date();
        Date exp = new Date(now.getTime() + jwtValidityMs);

        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(now)
                .expiration(exp)
                .signWith(getSigningKey(), Jwts.SIG.HS256) // o HS512 si tu key es buena
                .compact();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String username = getUsernameFromToken(token);
        Date exp = getExpirationDateFromToken(token);
        return username.equals(userDetails.getUsername()) && exp.after(new Date());
    }
}