package com.krishna.devhire_ai.service;

import com.krishna.devhire_ai.application.JobApplication;
import com.krishna.devhire_ai.entity.User;
import com.krishna.devhire_ai.job.Job;
import com.krishna.devhire_ai.repository.JobApplicationRepository;
import com.krishna.devhire_ai.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class CandidateDashboardService {

    private final UserRepository userRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final JobService jobService;

    public CandidateDashboardService(UserRepository userRepository,
                                     JobApplicationRepository jobApplicationRepository,
                                     JobService jobService) {
        this.userRepository = userRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.jobService = jobService;
    }

    public Map<String, Object> getDashboard(String email, String branch, String location, int resumeScore) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<JobApplication> myApplications = jobApplicationRepository.findByCandidateEmail(email);

        long shortlistedCount = myApplications.stream()
                .filter(app -> "SHORTLISTED".equalsIgnoreCase(app.getStatus()))
                .count();

        long rejectedCount = myApplications.stream()
                .filter(app -> "REJECTED".equalsIgnoreCase(app.getStatus()))
                .count();

        long pendingCount = myApplications.stream()
                .filter(app -> "PENDING".equalsIgnoreCase(app.getStatus()))
                .count();

        List<JobApplication> recentApplications = myApplications.stream()
                .sorted(Comparator.comparing(JobApplication::getAppliedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .limit(5)
                .toList();

        List<Job> recommendedJobs = jobService.recommendJobs(branch, location, resumeScore)
                .stream()
                .map(recommendation -> recommendation.getJob())
                .limit(5)
                .toList();

        Map<String, Object> dashboard = new LinkedHashMap<>();
        dashboard.put("name", user.getFullName());
        dashboard.put("email", user.getEmail());
        dashboard.put("role", user.getRole());
        dashboard.put("totalApplications", myApplications.size());
        dashboard.put("shortlistedApplications", shortlistedCount);
        dashboard.put("rejectedApplications", rejectedCount);
        dashboard.put("pendingApplications", pendingCount);
        dashboard.put("recentApplications", recentApplications);
        dashboard.put("recommendedJobs", recommendedJobs);

        return dashboard;
    }
}