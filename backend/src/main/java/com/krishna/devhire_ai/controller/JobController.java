package com.krishna.devhire_ai.controller;

import com.krishna.devhire_ai.dto.JobRecommendation;
import com.krishna.devhire_ai.job.Job;
import com.krishna.devhire_ai.service.JobService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    public Job saveJob(@RequestBody Job job, Authentication authentication) {
        job.setPostedBy(authentication.getName());
        return jobService.saveJob(job);
    }

    @GetMapping
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    @GetMapping("/recommend")
    public List<JobRecommendation> recommendJobs(@RequestParam String branch,
                                                 @RequestParam String location,
                                                 @RequestParam(defaultValue = "0") int resumeScore) {
        return jobService.recommendJobs(branch, location, resumeScore);
    }
}