package com.example.projeto_exiti.domain.service;

import com.example.projeto_exiti.domain.entity.User;
import jakarta.transaction.Transactional;

import java.util.List;

public interface UserService {
    User getByEmail(String email);
    User findByEmail(String email);
    User save(User user);
    List<User> findAll();
    void saveAll(List<User> users);
    void deleteByEmail(String email);
    @Transactional
    User update(User user);
}
