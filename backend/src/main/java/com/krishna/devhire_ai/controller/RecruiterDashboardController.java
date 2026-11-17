package com.krishna.devhire_ai.controller;

import com.krishna.devhire_ai.service.RecruiterDashboardService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/recruiter")
public class RecruiterDashboardController {

    private final RecruiterDashboardService recruiterDashboardService;

    public RecruiterDashboardController(RecruiterDashboardService recruiterDashboardService) {
        this.recruiterDashboardService = recruiterDashboardService;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard(Authentication authentication) {
        return recruiterDashboardService.getDashboard(authentication.getName());
    }
}