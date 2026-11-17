package com.krishna.devhire_ai.controller;

import com.krishna.devhire_ai.resume.Resume;
import com.krishna.devhire_ai.service.ResumeService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/resumes")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/upload")
    public Resume uploadResume(@RequestParam("fullName") String fullName,
                               @RequestParam("file") MultipartFile file,
                               Principal principal) throws Exception {
        return resumeService.saveResume(principal.getName(), fullName, file);
    }

    @GetMapping
    public List<Resume> getAllResumes() {
        return resumeService.getAllResumes();
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadResume(@PathVariable Long id) {
        Optional<Resume> optionalResume = resumeService.getResumeById(id);

        if (optionalResume.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Resume resume = optionalResume.get();

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + resume.getFileName() + "\"");

        MediaType mediaType = (resume.getFileType() != null && !resume.getFileType().isBlank())
                ? MediaType.parseMediaType(resume.getFileType())
                : MediaType.APPLICATION_OCTET_STREAM;

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(mediaType)
                .body(resume.getData());
    }
}