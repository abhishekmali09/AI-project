package com.abhi.aiservice.controller;

import com.abhi.aiservice.dto.FoodNutritionResponse;
import com.abhi.aiservice.servirce.FoodAnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/ai")
public class FoodAnalysisController {

    private final FoodAnalysisService foodAnalysisService;

    @PostMapping(value = "/analyze-food-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> analyzeFoodImage(
            @RequestParam("image") MultipartFile image) {
        try {
            if (image.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Image file is empty"));
            }

            String contentType = image.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(Map.of("error", "File must be an image"));
            }

            log.info("Received food image for analysis: {} ({} bytes)", image.getOriginalFilename(), image.getSize());
            FoodNutritionResponse response = foodAnalysisService.analyzeFoodImage(image);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error analyzing food image", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Unknown error"));
        }
    }
}
