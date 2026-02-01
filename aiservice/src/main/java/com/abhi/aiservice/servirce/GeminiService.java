package com.abhi.aiservice.servirce;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.url}")
    private String apiUrl;
    @Value("${gemini.api.key}")
    private String apiKey;
    @Value("${gemini.api.model}")
    private String model;

    public GeminiService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.webClient = webClientBuilder.build();
        this.objectMapper = objectMapper;
    }

    public String getAnswer(String question) {
        String content = question != null ? question : "";
        Map<String, Object> requestBody = Map.of(
                "model", model,
                "messages", List.of(Map.of("role", "user", "content", content))
        );

        String uri = apiUrl.contains("?") ? apiUrl + apiKey : apiUrl + "?key=" + apiKey;
        String responseBody = webClient.post()
                .uri(uri)
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + (apiKey != null ? apiKey : ""))
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        if (responseBody == null || responseBody.isBlank()) {
            return "";
        }
        try {
            JsonNode response = objectMapper.readTree(responseBody);
            if (!response.has("choices") || response.get("choices").isEmpty()) {
                return "";
            }
            JsonNode message = response.get("choices").get(0).get("message");
            return message != null && message.has("content") ? message.get("content").asText() : "";
        } catch (Exception e) {
            return "";
        }
    }
}
