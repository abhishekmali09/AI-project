package com.abhi.aiservice.modle;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;


@Data
public class Activity {

    private String id;
    private Long userId;
    private String type;
    private Integer duration;
    private Integer caloriesBurned;
    private LocalDateTime startTime ;
    private Map<String,Object> additionalMetrics;
    private LocalDateTime creationTime;
    private LocalDateTime updateAt;




}
