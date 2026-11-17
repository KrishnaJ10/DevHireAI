package com.krishna.devhire_ai.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ResumeAnalysisService {

    private static final Map<String, List<String>> BRANCH_KEYWORDS = createBranchKeywords();

    private static Map<String, List<String>> createBranchKeywords() {
        Map<String, List<String>> map = new HashMap<>();

        List<String> itKeywords = List.of(
                "java", "spring boot", "sql", "postgresql", "mysql",
                "hibernate", "rest api", "jwt", "html", "css",
                "javascript", "react", "aws", "docker", "git", "junit"
        );

        List<String> eceKeywords = List.of(
                "embedded systems", "microcontrollers", "vlsi", "signals",
                "communication systems", "digital electronics", "analog electronics",
                "rf", "antenna", "verilog", "matlab", "iot"
        );

        List<String> aimlKeywords = List.of(
                "python", "machine learning", "deep learning", "neural network",
                "tensorflow", "pytorch", "scikit-learn", "nlp",
                "cnn", "rnn", "statistics", "data preprocessing"
        );

        List<String> aidsKeywords = List.of(
                "python", "sql", "data analysis", "power bi", "tableau",
                "machine learning", "statistics", "data mining",
                "pandas", "numpy", "excel", "data visualization"
        );

        List<String> autoKeywords = List.of(
                "cad", "cam", "solidworks", "autocad", "manufacturing",
                "thermodynamics", "fluid mechanics", "machine design",
                "ansys", "vehicle dynamics", "automotive engineering", "simulation"
        );

        List<String> civilKeywords = List.of(
                "autocad", "staad pro", "surveying", "rcc", "estimation",
                "construction", "structural analysis", "geotechnical",
                "transportation", "project management", "revit"
        );

        List<String> electricalKeywords = List.of(
                "power systems", "control systems", "electrical machines", "circuits",
                "embedded systems", "microcontrollers", "power electronics",
                "matlab", "simulink", "switchgear", "renewable energy"
        );

        map.put("it", itKeywords);
        map.put("cse", itKeywords);

        map.put("ece", eceKeywords);
        map.put("extc", eceKeywords);

        map.put("aiml", aimlKeywords);
        map.put("aids", aidsKeywords);

        map.put("auto", autoKeywords);
        map.put("mechanical", autoKeywords);

        map.put("civil", civilKeywords);
        map.put("electrical", electricalKeywords);

        return map;
    }

    public String extractTextFromPdf(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    public Map<String, Object> analyzeResume(String branch, MultipartFile file) throws IOException {
        String normalizedBranch = normalizeBranch(branch);
        List<String> keywords = BRANCH_KEYWORDS.getOrDefault(normalizedBranch, BRANCH_KEYWORDS.get("it"));

        String text = extractTextFromPdf(file).toLowerCase();

        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();
        List<String> suggestions = new ArrayList<>();
        List<String> strengths = new ArrayList<>();

        for (String skill : keywords) {
            if (text.contains(skill.toLowerCase())) {
                matchedSkills.add(skill);
            } else {
                missingSkills.add(skill);
                suggestions.add("Add or mention: " + skill);
            }
        }

        int score = keywords.isEmpty() ? 0 : (matchedSkills.size() * 100) / keywords.size();

        if (score >= 75) {
            strengths.add("Strong branch-specific keyword coverage");
            strengths.add("Resume looks relevant for the selected domain");
        } else if (score >= 50) {
            strengths.add("Moderate keyword match");
            suggestions.add("Add more branch-specific projects and technical keywords");
        } else {
            strengths.add("Resume needs stronger technical relevance");
            suggestions.add("Add more branch-specific technical keywords");
            suggestions.add("Include projects with tools, technologies, and outcomes");
        }

        if (!text.contains("project")) {
            suggestions.add("Add a Projects section");
        } else {
            strengths.add("Projects section found");
        }

        if (!text.contains("experience") && !text.contains("internship")) {
            suggestions.add("Add internship or experience details");
        } else {
            strengths.add("Experience or internship details found");
        }

        if (!text.contains("education")) {
            suggestions.add("Add education details clearly");
        } else {
            strengths.add("Education section found");
        }

        if (!text.contains("github")) {
            suggestions.add("Add GitHub profile if you have projects");
        }

        if (!text.contains("linkedin")) {
            suggestions.add("Add LinkedIn profile if available");
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("branch", normalizedBranch.toUpperCase());
        response.put("resumeScore", score);
        response.put("matchedSkills", matchedSkills);
        response.put("missingSkills", missingSkills);
        response.put("strengths", strengths);
        response.put("suggestions", suggestions);
        response.put("extractedText", text);

        return response;
    }

    private String normalizeBranch(String branch) {
        if (branch == null || branch.isBlank()) {
            return "it";
        }

        String value = branch.trim().toLowerCase();

        if (value.contains("extc") || value.contains("ece")) return "extc";
        if (value.contains("aiml") || value.contains("ai/ml")) return "aiml";
        if (value.contains("aids")) return "aids";
        if (value.contains("auto")) return "auto";
        if (value.contains("mechanical")) return "mechanical";
        if (value.contains("civil")) return "civil";
        if (value.contains("electrical")) return "electrical";
        if (value.contains("cse") || value.contains("it")) return "it";

        return "it";
    }
}