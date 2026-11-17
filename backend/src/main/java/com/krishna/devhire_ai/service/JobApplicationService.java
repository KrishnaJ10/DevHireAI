package com.krishna.devhire_ai.service;

import com.krishna.devhire_ai.application.JobApplication;
import com.krishna.devhire_ai.repository.JobApplicationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;

    public JobApplicationService(JobApplicationRepository jobApplicationRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
    }

    public JobApplication applyJob(JobApplication application) {
        application.setStatus("APPLIED");
        application.setAppliedAt(LocalDateTime.now());
        return jobApplicationRepository.save(application);
    }

    public List<JobApplication> getAllApplications() {
        return jobApplicationRepository.findAll();
    }

    public List<JobApplication> getApplicationsByJobId(Long jobId) {
        return jobApplicationRepository.findByJobId(jobId);
    }

    public JobApplication updateApplicationStatus(Long id, String status) {
        JobApplication application = jobApplicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(status.toUpperCase());
        return jobApplicationRepository.save(application);
    }
}