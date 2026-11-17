package com.krishna.devhire_ai.service;

import com.krishna.devhire_ai.dto.JobRecommendation;
import com.krishna.devhire_ai.job.Job;
import com.krishna.devhire_ai.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class JobService {

    private static final Map<String, List<String>> BRANCH_KEYWORDS = createBranchKeywords();

    private static Map<String, List<String>> createBranchKeywords() {
        Map<String, List<String>> map = new HashMap<>();

        List<String> itKeywords = List.of(
                "java", "spring boot", "sql", "postgresql", "mysql",
                "hibernate", "rest api", "jwt", "html", "css",
                "javascript", "react", "aws", "docker", "git"
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

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public Job saveJob(Job job) {
        job.setPostedAt(LocalDateTime.now());
        return jobRepository.save(job);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public List<JobRecommendation> recommendJobs(String branch, String location, int resumeScore) {
        List<Job> allJobs = jobRepository.findAll();
        List<JobRecommendation> results = new ArrayList<>();

        for (Job job : allJobs) {
            int score = 0;
            List<String> reasons = new ArrayList<>();

            if (branch != null && job.getBranch() != null && job.getBranch().equalsIgnoreCase(branch)) {
                score += 40;
                reasons.add("Branch matches");
            }

            if (location != null && job.getLocation() != null && job.getLocation().equalsIgnoreCase(location)) {
                score += 25;
                reasons.add("Location matches");
            }

            int skillBonus = calculateSkillBonus(branch, job, reasons);
            score += skillBonus;

            int resumeBonus = Math.min(15, Math.max(0, resumeScore) / 7);
            if (resumeBonus > 0) {
                score += resumeBonus;
                reasons.add("Resume score adds " + resumeBonus + " points");
            }

            if (score >= 40) {
                results.add(new JobRecommendation(job, score, reasons));
            }
        }

        results.sort(
                Comparator.comparingInt(JobRecommendation::getScore).reversed()
                        .thenComparing(r -> r.getJob().getTitle(), String.CASE_INSENSITIVE_ORDER)
        );

        return results;
    }

    private int calculateSkillBonus(String branch, Job job, List<String> reasons) {
        if (branch == null || (job.getSkills() == null && job.getDescription() == null)) {
            return 0;
        }

        String normalizedBranch = normalizeBranch(branch);
        List<String> keywords = BRANCH_KEYWORDS.getOrDefault(normalizedBranch, BRANCH_KEYWORDS.get("it"));

        String combined = ((job.getSkills() == null ? "" : job.getSkills()) + " " +
                (job.getDescription() == null ? "" : job.getDescription())).toLowerCase();

        List<String> matchedKeywords = new ArrayList<>();
        int bonus = 0;

        for (String keyword : keywords) {
            if (combined.contains(keyword.toLowerCase())) {
                matchedKeywords.add(keyword);
                bonus += 4;
            }
        }

        if (!matchedKeywords.isEmpty()) {
            reasons.add("Skill matches: " + String.join(", ", matchedKeywords));
        }

        return Math.min(20, bonus);
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