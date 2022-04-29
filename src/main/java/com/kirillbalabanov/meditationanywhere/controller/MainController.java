package com.kirillbalabanov.meditationanywhere.controller;

import com.kirillbalabanov.meditationanywhere.config.UserDet;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.server.csrf.CsrfWebFilter;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import java.nio.file.attribute.UserPrincipal;
import java.util.HashMap;
import java.util.Map;

@Controller
public class MainController {

    @GetMapping("/principal")
    public ResponseEntity<?> authenticated() {
        HashMap<Object, Object> hashMap = new HashMap<>();
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof UserDet userDet)) {
            hashMap.put("authenticated", false);
            hashMap.put("username", "$anonymous");
        } else {
            hashMap.put("authenticated", true);
            hashMap.put("username", userDet.getUsername());
        }
        return ResponseEntity.ok().body(hashMap);
    }

}

