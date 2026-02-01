package com.abhi.aiservice.servirce;

import com.abhi.aiservice.modle.Activity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {

    private final GeminiService geminiService;

    public String generateRecommedation(Activity activity){
        String prompt =createPromptForActivity(activity);
        String aiResponse = geminiService.getAnswer(prompt);

        log .info("RESPONSE FROM AI:{} ", aiResponse);
        return aiResponse;
    }

    private String createPromptForActivity(Activity activity) {
        return String.format("""
                Analyze this fitness activity and provide detailed recommendations. Reply with ONLY valid JSON in this exact structure (no markdown or extra text):
                {
                  "analysis": {
                    "overall": "Overall analysis here",
                    "pace": "Pace analysis here",
                    "heartRate": "Heart rate analysis here",
                    "caloriesBurned": "Calories analysis here"
                  },
                  "improvements": [
                    {
                      "area": "Area name",
                      "recommendation": "Detailed recommendation"
                    }
                  ],
                  "suggestions": [
                    {
                      "workout": "Workout name",
                      "description": "Detailed workout description"
                    }
                  ],
                  "safety": [
                    "Safety point 1",
                    "Safety point 2"
                  ]
                }

                Activity to analyze:
                - Type: %s
                - Duration: %d minutes
                - Calories Burned: %d
                - Additional Metrics: %s

                Provide detailed analysis on performance, improvements, next workout suggestions, and safety. Response must be valid JSON only.
                """,
                activity.getType(),
                activity.getDuration() != null ? activity.getDuration() : 0,
                activity.getCaloriesBurned() != null ? activity.getCaloriesBurned() : 0,
                activity.getAdditionalMetrics() != null ? activity.getAdditionalMetrics() : ""
        );
    }

}
