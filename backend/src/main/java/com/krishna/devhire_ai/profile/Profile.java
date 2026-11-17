package com.krishna.devhire_ai.profile;

import jakarta.persistence.*;

@Entity
@Table(name = "profiles")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @Column(length = 1000)
    private String skills;

    @Column(length = 2000)
    private String bio;

    private String experience;

    @Column(length = 1000)
    private String education;

    public Profile() {
    }

    public Profile(Long id, String fullName, String skills, String bio, String experience, String education) {
        this.id = id;
        this.fullName = fullName;
        this.skills = skills;
        this.bio = bio;
        this.experience = experience;
        this.education = education;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }
}