package com.kirillbalabanov.meditationanywhere.controller;

import com.kirillbalabanov.meditationanywhere.config.UserDet;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class StatsController {
    private final StatsService statsService;

    public StatsController(@Autowired StatsService statsService) {
        this.statsService = statsService;
    }

    @PutMapping("/updateStats")
    public void updateStats(@RequestBody Map<String, String> map) throws NoUserFoundException {
        // getting session's minListened, fetched by js.
        long minListened = Long.parseLong(map.get("minListened"));

        UserDet principal = (UserDet) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        statsService.updateStats(minListened, principal.getUserId());
    }
}

