package com.krishna.devhire_ai.service;

import com.krishna.devhire_ai.application.JobApplication;
import com.krishna.devhire_ai.job.Job;
import com.krishna.devhire_ai.repository.JobApplicationRepository;
import com.krishna.devhire_ai.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class RecruiterDashboardService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository jobApplicationRepository;

    public RecruiterDashboardService(JobRepository jobRepository,
                                     JobApplicationRepository jobApplicationRepository) {
        this.jobRepository = jobRepository;
        this.jobApplicationRepository = jobApplicationRepository;
    }

    public Map<String, Object> getDashboard(String recruiterEmail) {
        List<Job> recruiterJobs = jobRepository.findByPostedBy(recruiterEmail);
        List<Long> jobIds = recruiterJobs.stream().map(Job::getId).toList();

        List<JobApplication> recruiterApplications = jobIds.isEmpty()
                ? List.of()
                : jobApplicationRepository.findByJobIdIn(jobIds);

        List<Job> recentJobs = recruiterJobs.stream()
                .sorted(Comparator.comparing(Job::getPostedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .limit(5)
                .toList();

        List<JobApplication> recentApplications = recruiterApplications.stream()
                .sorted(Comparator.comparing(JobApplication::getAppliedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .limit(5)
                .toList();

        long shortlistedCount = recruiterApplications.stream()
                .filter(app -> "SHORTLISTED".equalsIgnoreCase(app.getStatus()))
                .count();

        long rejectedCount = recruiterApplications.stream()
                .filter(app -> "REJECTED".equalsIgnoreCase(app.getStatus()))
                .count();

        long pendingCount = recruiterApplications.stream()
                .filter(app -> "PENDING".equalsIgnoreCase(app.getStatus()))
                .count();

        Map<String, Object> dashboard = new LinkedHashMap<>();
        dashboard.put("totalJobs", recruiterJobs.size());
        dashboard.put("totalApplications", recruiterApplications.size());
        dashboard.put("shortlistedApplications", shortlistedCount);
        dashboard.put("rejectedApplications", rejectedCount);
        dashboard.put("pendingApplications", pendingCount);
        dashboard.put("recentJobs", recentJobs);
        dashboard.put("recentApplications", recentApplications);

        return dashboard;
    }
}