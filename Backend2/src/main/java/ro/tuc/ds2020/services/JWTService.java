package ro.tuc.ds2020.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.UUID;

@Service
public class JWTService {

    private String secretKey = "101E699999999999999994435w798w74t89w789t7wt8743B5970";

    private long jwtExpiration = 90000000;

    private long refreshExpiration = 604800000;

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUserRole(String token) {
        Key key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .parseClaimsJws(token)
                .getBody();

        return claims.get("role", String.class);
    }

    public String extractUserId(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(Decoders.BASE64.decode(secretKey))
                .parseClaimsJws(token)
                .getBody();

        return claims.get("id", String.class);
    }
}
