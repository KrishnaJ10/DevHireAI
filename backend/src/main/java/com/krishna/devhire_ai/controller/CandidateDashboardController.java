package com.krishna.devhire_ai.controller;

import com.krishna.devhire_ai.service.CandidateDashboardService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/candidate")
public class CandidateDashboardController {

    private final CandidateDashboardService candidateDashboardService;

    public CandidateDashboardController(CandidateDashboardService candidateDashboardService) {
        this.candidateDashboardService = candidateDashboardService;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard(@RequestParam String branch,
                                         @RequestParam String location,
                                         @RequestParam(defaultValue = "0") int resumeScore,
                                         Authentication authentication) {
        String email = authentication.getName();
        return candidateDashboardService.getDashboard(email, branch, location, resumeScore);
    }
}