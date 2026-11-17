package com.krishna.devhire_ai.controller;

import com.krishna.devhire_ai.dto.JobRecommendation;
import com.krishna.devhire_ai.service.JobService;
import com.krishna.devhire_ai.service.ResumeAnalysisService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/career")
public class CareerRecommendationController {

    private final ResumeAnalysisService resumeAnalysisService;
    private final JobService jobService;

    public CareerRecommendationController(ResumeAnalysisService resumeAnalysisService, JobService jobService) {
        this.resumeAnalysisService = resumeAnalysisService;
        this.jobService = jobService;
    }

    @PostMapping(value = "/recommend", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, Object> recommendCareer(@RequestParam("branch") String branch,
                                               @RequestParam("location") String location,
                                               @RequestParam("file") MultipartFile file) throws Exception {

        Map<String, Object> analysis = resumeAnalysisService.analyzeResume(branch, file);
        int resumeScore = ((Number) analysis.get("resumeScore")).intValue();

        List<JobRecommendation> recommendedJobs = jobService.recommendJobs(branch, location, resumeScore);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("branch", analysis.get("branch"));
        response.put("resumeScore", analysis.get("resumeScore"));
        response.put("matchedSkills", analysis.get("matchedSkills"));
        response.put("missingSkills", analysis.get("missingSkills"));
        response.put("suggestions", analysis.get("suggestions"));
        response.put("recommendedJobs", recommendedJobs.subList(0, Math.min(5, recommendedJobs.size())));

        return response;
    }
}