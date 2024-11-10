package com.example.ztpai.controller;

import com.example.ztpai.auth.AuthRequest;
import com.example.ztpai.config.JwtService;
import com.example.ztpai.entitie.User;
import com.example.ztpai.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
public class UserController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @GetMapping("/getById/{uuid}")
    @PreAuthorize("hasAuthority('MANAGER') || hasAuthority('EMPLOYEE')")
    public User getById(@PathVariable("uuid") UUID uuid, HttpServletResponse response) throws IOException {
        if(userService.existsById(uuid) == false) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "User not found!");
            return null;
        }

        return userService.getById(uuid);
    }

    @GetMapping("/getAll")
    @PreAuthorize("hasAuthority('MANAGER') || hasAuthority('EMPLOYEE')")
    public List<User> getAll() {
        return userService.getAll();
    }

    @GetMapping("/getMe")
    @PreAuthorize("hasAuthority('MANAGER') || hasAuthority('EMPLOYEE')")
    public User getMe(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        UUID id_user = jwtService.getUserIdFromToken(token);
        return userService.getById(id_user);
    }

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('MANAGER')")
    public void addUser(@RequestBody User user, HttpServletResponse response) throws IOException {
        if(user.getFirstName() != null && user.getLastName() != null && user.getUsername() != null && user.getPassword() != null && user.getRole() != null) {
            userService.addUser(user);
            return;
        }
        response.sendError(HttpServletResponse.SC_CONFLICT, "Missing required fields!");
    }

    @DeleteMapping("/delete/{uuid}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public void deleteById(@PathVariable("uuid") UUID uuid, HttpServletResponse respponse) throws IOException {
        if(userService.getById(uuid) != null) {
            userService.deleteById(uuid);
            return;
        }
        respponse.sendError(HttpServletResponse.SC_NOT_FOUND, "User not found!");
    }

    @PatchMapping("/edit/{uuid}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public void editById(@PathVariable("uuid") UUID uuid, @RequestBody User user, HttpServletResponse response) throws IOException {
        if(userService.getById(uuid) != null) {
            userService.editById(uuid, user);
            return;
        }
        response.sendError(HttpServletResponse.SC_NOT_FOUND, "User not found!");
    }

    @PostMapping("/authenticate")
    public ResponseEntity<Map<String, String>> authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
            if(authentication.isAuthenticated()) {
                var result = jwtService.generateToken(authRequest.getUsername());

                Map<String, String> response = new HashMap<>();
                response.put("token", result);

                return ResponseEntity.ok(response);
            } else {
                throw new UsernameNotFoundException("Invalid user request!");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
