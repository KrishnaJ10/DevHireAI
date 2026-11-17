package com.krishna.devhire_ai.controller;

import com.krishna.devhire_ai.application.JobApplication;
import com.krishna.devhire_ai.service.JobApplicationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    public JobApplicationController(JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
    }

    @PostMapping
    public JobApplication applyJob(@RequestBody JobApplication application) {
        return jobApplicationService.applyJob(application);
    }

    @GetMapping
    public List<JobApplication> getAllApplications() {
        return jobApplicationService.getAllApplications();
    }

    @GetMapping("/job/{jobId}")
    public List<JobApplication> getApplicationsByJobId(@PathVariable Long jobId) {
        return jobApplicationService.getApplicationsByJobId(jobId);
    }

    @PutMapping("/{id}/status")
    public JobApplication updateApplicationStatus(@PathVariable Long id,
                                                  @RequestParam String status) {
        return jobApplicationService.updateApplicationStatus(id, status);
    }
}