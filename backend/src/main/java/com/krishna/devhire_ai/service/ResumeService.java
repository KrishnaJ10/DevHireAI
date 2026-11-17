package com.krishna.devhire_ai.service;

import com.krishna.devhire_ai.entity.User;
import com.krishna.devhire_ai.repository.ResumeRepository;
import com.krishna.devhire_ai.repository.UserRepository;
import com.krishna.devhire_ai.resume.Resume;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    public ResumeService(ResumeRepository resumeRepository, UserRepository userRepository) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
    }

    public Resume saveResume(String email, String fullName, MultipartFile file) throws IOException {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();

        Resume resume = new Resume();
        resume.setFullName(fullName);
        resume.setFileName(file.getOriginalFilename());
        resume.setFileType(file.getContentType());
        resume.setData(file.getBytes());
        resume.setUser(user);

        return resumeRepository.save(resume);
    }

    public List<Resume> getAllResumes() {
        return resumeRepository.findAll();
    }

    public Optional<Resume> getResumeById(Long id) {
        return resumeRepository.findById(id);
    }
}