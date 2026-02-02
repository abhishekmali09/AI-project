package com.abhi.aiservice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

/**
 * DTO for the external AI API response. Structure must match the JSON returned by the AI.
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ActivityAIResponse {

    private Analysis analysis;
    private List<ImprovementItem> improvements;
    private List<SuggestionItem> suggestions;
    private List<String> safety;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Analysis {
        private String overall;
        private String pace;
        @JsonProperty("heartRate")
        private String heartRate;
        @JsonProperty("caloriesBurned")
        private String caloriesBurned;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ImprovementItem {
        private String area;
        private String recommendation;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SuggestionItem {
        private String workout;
        private String description;
    }
}
