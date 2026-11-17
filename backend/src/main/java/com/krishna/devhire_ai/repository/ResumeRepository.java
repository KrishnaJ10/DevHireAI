package com.krishna.devhire_ai.repository;

import com.krishna.devhire_ai.resume.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeRepository extends JpaRepository<Resume, Long> {
}