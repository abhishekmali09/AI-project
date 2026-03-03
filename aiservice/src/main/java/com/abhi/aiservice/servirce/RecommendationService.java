package com.abhi.aiservice.servirce;


import com.abhi.aiservice.modle.Recommendation;
import com.abhi.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final RecommendationRepository recommendationRepository;

    public List<Recommendation> getUserRecommendtion(String userId) {
      return recommendationRepository.findByUserId(userId);
    }

    public Recommendation getActivityRecommendtion(String activityId) {

        return recommendationRepository.findByActivityId(activityId)
                .orElseThrow(()-> new RuntimeException("Activity not found " + activityId));
    }
}