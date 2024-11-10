package com.example.ztpai.controller;

import com.example.ztpai.config.JwtService;
import com.example.ztpai.entitie.Availability;
import com.example.ztpai.entitie.User;
import com.example.ztpai.service.AvailabilityService;
import com.example.ztpai.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/availability")
public class AvailabilityController {
    public final AvailabilityService availabilityService;
    public final JwtService jwtService;
    public final UserService userService;


    @GetMapping("/getAll")
    @PreAuthorize("hasAuthority('MANAGER')")
    public List<Availability> getAll() {
        return availabilityService.getAll();
    }

    @GetMapping("/getById/{uuid}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public Availability getById(@PathVariable("uuid") UUID uuid, HttpServletResponse response) throws IOException {
        if(availabilityService.existsById(uuid) == false) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Availability not found!");
            return null;
        }
        return availabilityService.getById(uuid);
    }

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('EMPLOYEE')")
    public void addAvailability(@RequestBody Availability availability, @RequestHeader("Authorization") String authHeader, HttpServletResponse response) throws IOException {
        String token = authHeader.substring(7);
        UUID id_user = jwtService.getUserIdFromToken(token);
        User user = userService.getById(id_user);

        availability.setUser(user);

        availabilityService.addAvailability(availability);
    }
}
