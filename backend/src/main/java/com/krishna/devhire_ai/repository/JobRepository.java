package com.krishna.devhire_ai.repository;

import com.krishna.devhire_ai.job.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByPostedBy(String postedBy);
}