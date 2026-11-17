package com.krishna.devhire_ai.dto;

import com.krishna.devhire_ai.job.Job;

import java.util.List;

public class JobRecommendation {

    private Job job;
    private int score;
    private List<String> reasons;

    public JobRecommendation() {
    }

    public JobRecommendation(Job job, int score, List<String> reasons) {
        this.job = job;
        this.score = score;
        this.reasons = reasons;
    }

    public Job getJob() {
        return job;
    }

    public void setJob(Job job) {
        this.job = job;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public List<String> getReasons() {
        return reasons;
    }

    public void setReasons(List<String> reasons) {
        this.reasons = reasons;
    }
}