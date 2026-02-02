package com.abhi.aiservice.servirce;

import com.abhi.aiservice.modle.Activity;
import com.abhi.aiservice.modle.Recommendation;
import com.abhi.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityMessageListener {

    private final ActivityAIService activityAIService;
    private final RecommendationRepository recommendationRepository;

    @RabbitListener(queues = "activity.queue")
    public void processActivity(Activity activity) {
        log.info("Received activity for processing: {}", activity.getId());
        Recommendation recommendation = activityAIService.generateRecommedation(activity);
        Recommendation saved = recommendationRepository.save(recommendation);
        log.info("Generated and saved recommendation: id={}, activityId={}", saved.getId(), saved.getActivityId());
    }
}
