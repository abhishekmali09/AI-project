package com.abhi.aiservice.mapper;

import com.abhi.aiservice.dto.ActivityAIResponse;
import com.abhi.aiservice.modle.Activity;
import com.abhi.aiservice.modle.Recommendation;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Maps external AI API response into the Recommendation domain model.
 */
@Component
public class RecommendationMapper {

    /**
     * Transforms AI response and activity context into a domain Recommendation.
     */
    public Recommendation toRecommendation(Activity activity, ActivityAIResponse aiResponse) {
        if (aiResponse == null) {
            return null;
        }

        String recommendationText = buildRecommendationText(aiResponse.getAnalysis());
        List<String> improvements = mapImprovements(aiResponse.getImprovements());
        List<String> suggestions = mapSuggestions(aiResponse.getSuggestions());
        List<String> safety = aiResponse.getSafety() != null ? aiResponse.getSafety() : Collections.emptyList();

        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .activityType(activity.getType())
                .recommendation(recommendationText)
                .improvments(improvements)
                .suggerstion(suggestions)
                .safety(safety)
                .build();
    }

    private String buildRecommendationText(ActivityAIResponse.Analysis analysis) {
        if (analysis == null) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        appendIfPresent(sb, "Overall", analysis.getOverall());
        appendIfPresent(sb, "Pace", analysis.getPace());
        appendIfPresent(sb, "Heart rate", analysis.getHeartRate());
        appendIfPresent(sb, "Calories burned", analysis.getCaloriesBurned());
        return sb.toString().trim();
    }

    private void appendIfPresent(StringBuilder sb, String label, String value) {
        if (value != null && !value.isBlank()) {
            if (sb.length() > 0) sb.append("\n\n");
            sb.append(label).append(": ").append(value);
        }
    }

    private List<String> mapImprovements(List<ActivityAIResponse.ImprovementItem> improvements) {
        if (improvements == null || improvements.isEmpty()) {
            return Collections.emptyList();
        }
        return improvements.stream()
                .map(item -> item.getArea() + ": " + (item.getRecommendation() != null ? item.getRecommendation() : ""))
                .collect(Collectors.toList());
    }

    private List<String> mapSuggestions(List<ActivityAIResponse.SuggestionItem> suggestions) {
        if (suggestions == null || suggestions.isEmpty()) {
            return Collections.emptyList();
        }
        return suggestions.stream()
                .map(item -> item.getWorkout() + ": " + (item.getDescription() != null ? item.getDescription() : ""))
                .collect(Collectors.toList());
    }
}
