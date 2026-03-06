package com.abhi.aiservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class FoodNutritionResponse {
    private String foodName;
    private List<String> ingredients;
    private int calories;
    private String protein;
    private String carbohydrates;
    private String fat;
    private String fiber;
    private String sugar;
    private String healthRating;
    private String explanation;
}
