package com.kirillbalabanov.meditationanywhere.controller;

import com.kirillbalabanov.meditationanywhere.config.UserDet;
import com.kirillbalabanov.meditationanywhere.entity.StatsEntity;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.model.ErrorModel;
import com.kirillbalabanov.meditationanywhere.model.StatsModel;
import com.kirillbalabanov.meditationanywhere.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(value = "/user/stats")
public class StatsController {
    private final StatsService statsService;

    public StatsController(@Autowired StatsService statsService) {
        this.statsService = statsService;
    }

    @PutMapping("/updateStats")
    public ResponseEntity<?> updateStats(@RequestBody Map<String, String> map) throws NoUserFoundException {
        if (map.size() != 1) {
            return ResponseEntity.ok().body(ErrorModel.fromMessage("Invalid arguments."));
        }

        // getting session's minListened, fetched by js.
        int minListened = Integer.parseInt(map.get("minListened"));

        UserDet principal = (UserDet) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        StatsEntity statsEntity = statsService.updateStats(minListened, principal.getUserId());
        return ResponseEntity.ok().body(StatsModel.toModel(statsEntity));
    }

}

