package com.kirillbalabanov.meditationanywhere.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;

@Controller
public class ErrorControllerImp implements ErrorController {

    @GetMapping("/error")
    public String showErrorPage(Model model, HttpServletRequest request) {
        int statusCode = (int) request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        String message = (String) request.getAttribute(RequestDispatcher.ERROR_MESSAGE);

        switch (statusCode) {
            case 404 -> message = "Page not found.";
            case 403 -> message = "Access denied.";
            case 405 -> message = "Unsupported operation.";
        }

        model.addAttribute("status_code", statusCode);
        model.addAttribute("error_message", message);
        return "error";
    }
}
