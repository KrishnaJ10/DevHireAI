package com.krishna.devhire_ai.repository;

import com.krishna.devhire_ai.profile.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
}