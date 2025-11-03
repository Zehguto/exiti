package com.example.projeto_exiti.infra.repository;

import com.example.projeto_exiti.domain.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE u.email = :email")
    User findByEmail(@Param("email") String email);

    boolean existsByEmail(String email);

    @Transactional
    void deleteByEmail(String email);
}
