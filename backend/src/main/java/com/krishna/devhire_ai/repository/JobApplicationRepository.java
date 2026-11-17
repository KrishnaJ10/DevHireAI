package com.krishna.devhire_ai.repository;

import com.krishna.devhire_ai.application.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
    List<JobApplication> findByJobId(Long jobId);
    List<JobApplication> findByCandidateEmail(String candidateEmail);
    List<JobApplication> findByJobIdIn(List<Long> jobIds);
}