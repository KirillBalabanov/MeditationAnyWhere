package com.kirillbalabanov.meditationanywhere.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Test {

    @GetMapping("/hi")
    public String hi() {
        return "hi from backend";
    }
}
