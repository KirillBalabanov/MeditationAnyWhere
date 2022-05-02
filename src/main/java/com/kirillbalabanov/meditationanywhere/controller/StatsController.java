package com.kirillbalabanov.meditationanywhere.controller;

import com.kirillbalabanov.meditationanywhere.config.UserDet;
import com.kirillbalabanov.meditationanywhere.entity.StatsEntity;
import com.kirillbalabanov.meditationanywhere.exception.user.NoUserFoundException;
import com.kirillbalabanov.meditationanywhere.model.StatsModel;
import com.kirillbalabanov.meditationanywhere.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class StatsController {
    private final StatsService statsService;

    public StatsController(@Autowired StatsService statsService) {
        this.statsService = statsService;
    }

    @PutMapping("/updateStats")
    public ResponseEntity<?> updateStats(@RequestBody Map<String, String> map) throws NoUserFoundException {
        if (map.size() != 1) {
            HashMap<Object, Object> hm = new HashMap<>();
            hm.put("error", "Invalid arguments");
            return ResponseEntity.ok().body(hm);
        }

        // getting session's minListened, fetched by js.
        int minListened = Integer.parseInt(map.get("minListened"));
        System.out.println(minListened);
        UserDet principal = (UserDet) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        StatsEntity statsEntity = statsService.updateStats(minListened, principal.getUserId());
        return ResponseEntity.ok().body(StatsModel.toModel(statsEntity));
    }

}

