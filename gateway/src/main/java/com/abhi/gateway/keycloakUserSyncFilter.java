package com.abhi.gateway;

import com.abhi.gateway.user.RegisterRequest;
import com.abhi.gateway.user.UserService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
@Slf4j
@RequiredArgsConstructor
public class keycloakUserSyncFilter implements WebFilter {
    private final UserService userService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {

        String userIdHeader = exchange.getRequest().getHeaders().getFirst("X-User-ID");
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");

        // If there is no usable token, just continue the filter chain.
        RegisterRequest registerRequest = null;
        if (token != null && !token.isBlank()) {
            registerRequest = getUserDetails(token);
        }
        if (registerRequest == null) {
            return chain.filter(exchange);
        }

        String keycloakId = registerRequest.getKeycloakId();
        String effectiveUserId = (userIdHeader != null) ? userIdHeader : keycloakId;

        final RegisterRequest finalRegisterRequest = registerRequest;
        final String finalUserId = effectiveUserId;

        return userService.validateUser(keycloakId)
                    .flatMap(exist -> {
                        if (!exist) {
                            // Register user based on token claims
                            return userService.registerUser(finalRegisterRequest)
                                    .then(Mono.empty());
                        } else {
                            log.info("User already exist , Skipping sync,");
                            return Mono.empty();
                        }
                    })
                    .then(Mono.defer(() -> {
                        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                                .header("X-User-ID", finalUserId)
                                .build();

                        return chain.filter(exchange.mutate().request(mutatedRequest).build());
                    }));
    }

    private RegisterRequest getUserDetails(String token) {

        try{
            String tokenWithoutBearer = token.replace("Bearer", "").trim();
            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            RegisterRequest registerRequest = new RegisterRequest();
            registerRequest.setEmail(claims.getStringClaim("email"));
            registerRequest.setKeycloakId(claims.getStringClaim("sub"));
            registerRequest.setPassword("dummy@123");
            registerRequest.setFirstName(claims.getStringClaim("given_name"));
            registerRequest.setLastName(claims.getStringClaim("family_name"));

            return registerRequest;
        } catch (Exception e){
            e.printStackTrace();
            return null;
    }
    }}

