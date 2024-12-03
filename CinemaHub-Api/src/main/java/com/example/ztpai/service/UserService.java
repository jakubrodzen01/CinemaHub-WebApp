package com.example.ztpai.service;

import com.example.ztpai.entity.*;
import com.example.ztpai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public boolean existsById(UUID uuid) {
        return userRepository.existsById(uuid);
    }

    public void addUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public void deleteById(UUID uuid) {
        userRepository.deleteById(uuid);
    }

    public void editById(UUID uuid, User user) {
        User editUser = userRepository.findById(uuid).get();
        editUser.setIdUser(uuid);
        editUser.setFirstName(user.getFirstName());
        editUser.setLastName(user.getLastName());
        editUser.setUsername(user.getUsername());
        editUser.setPassword(passwordEncoder.encode(user.getPassword()));
        editUser.setRole(user.getRole());
        userRepository.save(editUser);
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User getById(UUID uuid) {
        return userRepository.findById(uuid).orElseThrow(() -> new UsernameNotFoundException("User not found!"));
    }

    public User getByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found!"));
    }
}
