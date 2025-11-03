package com.example.projeto_exiti.application.users;

import com.example.projeto_exiti.domain.entity.User;
import com.example.projeto_exiti.domain.exception.TuplaDuplicada;
import com.example.projeto_exiti.domain.service.UserService;
import com.example.projeto_exiti.infra.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor


public class UserServiceImp implements UserService {
    private final UserRepository userRepository;

    @Override
    public User getByEmail(String email){
        return userRepository.findByEmail(email);
    }

    @Override
    public User findByEmail(String email) {
        System.out.println("Buscando usuário com email: " + email);
        return userRepository.findByEmail(email);
    }

    @Override
    @Transactional
    public User save(User user) {
        var possibleuser = getByEmail(user.getEmail());
        if (possibleuser != null) {
            throw new TuplaDuplicada(User.class.getName());
        }
        return userRepository.save(user);
    }
    @Override
    public List<User> findAll(){
        return userRepository.findAll();
    }

    @Transactional
    public void saveAll(List<User> users) {
        for (User user : users) {
            var existing = getByEmail(user.getEmail());
            if (existing == null) {
                userRepository.save(user);
            } else {
                System.out.println("Usuário duplicado: " + user.getEmail());
            }
        }
    }

    @Transactional
    @Override
    public User update(User user) {
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteByEmail(String email) {
        userRepository.deleteByEmail(email);
    }
}
