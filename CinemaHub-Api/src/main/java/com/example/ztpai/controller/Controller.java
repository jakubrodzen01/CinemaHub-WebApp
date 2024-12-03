package com.example.ztpai.controller;

import com.example.ztpai.auth.AuthRequest;
import com.example.ztpai.config.JwtService;
import com.example.ztpai.entity.User;
import com.example.ztpai.repository.UserRepository;
import com.example.ztpai.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class Controller {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService createUser;


    @GetMapping("/hello")
    public String welcome() {
        return "Non secured endpoint";
    }

    @PostMapping("/new")
    public String addNewUser(@RequestBody User user) {
        createUser.addUser(user);
        return "New user created";
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('MANAGER')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{uuid}")
    @PreAuthorize("hasAuthority('EMPLOYEE')")
    public User getUserById(@PathVariable("uuid") UUID uuid) {
        return userRepository.findById(uuid).orElseThrow(RuntimeException::new);
    }

    @PostMapping("/authenticate")
    public String authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
            if(authentication.isAuthenticated()) {
                return jwtService.generateToken(authRequest.getUsername());
            } else {
                throw new UsernameNotFoundException("Invalid user request!");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
