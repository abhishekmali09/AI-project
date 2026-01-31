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

    }

    private String createPromptForActivity(Activity activity){

    }

}

