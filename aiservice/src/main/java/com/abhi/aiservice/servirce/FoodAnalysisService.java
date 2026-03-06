package com.abhi.aiservice.servirce;

import com.abhi.aiservice.dto.FoodNutritionResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class FoodAnalysisService {

    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.url}")
    private String apiUrl;
    @Value("${gemini.api.key}")
    private String apiKey;
    @Value("${gemini.api.vision-model}")
    private String visionModel;

    private static final String FOOD_ANALYSIS_PROMPT = """
            Analyze this food image and provide detailed nutrition information.
            Reply with ONLY valid JSON in this exact structure (no markdown, no extra text):
            {
              "foodName": "Name of the detected food",
              "ingredients": ["ingredient1", "ingredient2"],
              "calories": 0,
              "protein": "0g",
              "carbohydrates": "0g",
              "fat": "0g",
              "fiber": "0g",
              "sugar": "0g",
              "healthRating": "Healthy/Moderate/Unhealthy",
              "explanation": "Brief health explanation of this meal"
            }

            Be as accurate as possible with the nutritional estimates based on the food visible in the image.
            The calories field must be a number (not a string).
            Response must be valid JSON only.
            """;

    public FoodNutritionResponse analyzeFoodImage(MultipartFile file) throws IOException {
        String base64Image = Base64.getEncoder().encodeToString(file.getBytes());
        String mimeType = file.getContentType() != null ? file.getContentType() : "image/jpeg";

        Map<String, Object> requestBody = buildVisionRequest(base64Image, mimeType);

        String uri = apiUrl.contains("?") ? apiUrl + apiKey : apiUrl + "?key=" + apiKey;

        log.info("Calling AI vision API: model={}, uri={}", visionModel, apiUrl);

        String responseBody = webClientBuilder
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(16 * 1024 * 1024))
                .build()
                .post()
                .uri(uri)
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(HttpStatusCode::isError, clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("AI API error response [{}]: {}", clientResponse.statusCode(), errorBody);
                                    return Mono.error(new RuntimeException(
                                            "AI API returned " + clientResponse.statusCode() + ": " + errorBody));
                                })
                )
                .bodyToMono(String.class)
                .block();

        log.info("Food analysis AI response received");

        return parseResponse(responseBody);
    }

    private Map<String, Object> buildVisionRequest(String base64Image, String mimeType) {
        Map<String, Object> imageContent = Map.of(
                "type", "image_url",
                "image_url", Map.of(
                        "url", "data:" + mimeType + ";base64," + base64Image
                )
        );

        Map<String, Object> textContent = Map.of(
                "type", "text",
                "text", FOOD_ANALYSIS_PROMPT
        );

        return Map.of(
                "model", visionModel,
                "messages", List.of(
                        Map.of(
                                "role", "user",
                                "content", List.of(textContent, imageContent)
                        )
                )
        );
    }

    private FoodNutritionResponse parseResponse(String responseBody) {
        if (responseBody == null || responseBody.isBlank()) {
            throw new RuntimeException("Empty response from AI service");
        }

        try {
            JsonNode response = objectMapper.readTree(responseBody);
            log.info("AI response JSON structure: {}", response.fieldNames());

            String content = "";
            if (response.has("choices") && !response.get("choices").isEmpty()) {
                JsonNode message = response.get("choices").get(0).get("message");
                if (message != null && message.has("content")) {
                    content = message.get("content").asText();
                }
            }

            if (content.isBlank()) {
                log.error("No content extracted from AI response: {}", responseBody);
                throw new RuntimeException("No content in AI response");
            }

            String jsonContent = content
                    .replaceAll("(?s)^\\s*```(?:json)?\\s*", "")
                    .replaceAll("(?s)\\s*```\\s*$", "")
                    .trim();

            log.info("Parsed food analysis JSON: {}", jsonContent);
            return objectMapper.readValue(jsonContent, FoodNutritionResponse.class);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to parse food analysis response", e);
            throw new RuntimeException("Failed to parse AI response: " + e.getMessage(), e);
        }
    }
}
