package com.abhi.activityservice.services;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserValidationService {
    private final WebClient userServiceWebClient;

    public boolean validateUser(String userId) {
        log.info("Calling User Validation API for keycloakId: " + userId);
        try{
            return Boolean.TRUE.equals(userServiceWebClient.get()
                    .uri("/api/users/by-keycloak/{keycloakId}/validate", userId)
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .block());

        }catch (WebClientResponseException e){

            if (e.getStatusCode() == HttpStatus.NOT_FOUND)
                throw new RuntimeException("User not found with keycloakId: " + userId);
            else if (e.getStatusCode() == HttpStatus.BAD_REQUEST)
                throw new RuntimeException("Invalid Request for keycloakId: " + userId);
        }

        return false;
    }
}
