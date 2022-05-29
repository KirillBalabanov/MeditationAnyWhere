package com.kirillbalabanov.meditationanywhere.controller;

import com.kirillbalabanov.meditationanywhere.config.UserDet;
import com.kirillbalabanov.meditationanywhere.entity.StatsEntity;
import com.kirillbalabanov.meditationanywhere.model.StatsModel;
import com.kirillbalabanov.meditationanywhere.model.frontend.SessionEndModel;
import com.kirillbalabanov.meditationanywhere.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/users/current/stats")
public class StatsController {
    private final StatsService statsService;

    public StatsController(@Autowired StatsService statsService) {
        this.statsService = statsService;
    }

    @PutMapping("/updateStats")
    public ResponseEntity<?> updateStats(@RequestBody SessionEndModel sessionEndModel) {
        int minListened = Integer.parseInt(sessionEndModel.minListened());
        UserDet principal = (UserDet) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        StatsEntity statsEntity = statsService.updateStats(minListened, principal.getUserId());
        return ResponseEntity.ok().body(StatsModel.toModel(statsEntity));
    }

}

