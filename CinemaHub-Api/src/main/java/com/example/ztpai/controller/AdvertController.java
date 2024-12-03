package com.example.ztpai.controller;

import com.example.ztpai.config.JwtService;
import com.example.ztpai.entity.Advert;
import com.example.ztpai.entity.User;
import com.example.ztpai.service.AdvertService;
import com.example.ztpai.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.Date;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/adverts")
public class AdvertController {
    private final AdvertService advertService;
    private final JwtService jwtService;
    private final UserService userService;

    @GetMapping("/getAll")
    @PreAuthorize("hasAuthority('MANAGER') || hasAuthority('EMPLOYEE')")
    public List<Advert> getAll() {
        return advertService.getAll();
    }

    @GetMapping("/getById/{uuid}")
    @PreAuthorize("hasAuthority('MANAGER') || hasAuthority('EMPLOYEE')")
    public Advert getById(@PathVariable("uuid") UUID uuid, HttpServletResponse response) throws IOException {
        if(advertService.existsById(uuid) == false) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Advert not found!");
            return null;
        }

        return advertService.getById(uuid);
    }

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('MANAGER')")
    public void addAdvert(@RequestBody Advert advert, @RequestHeader("Authorization") String authHeader, HttpServletResponse response) throws IOException {
        if(advert.getTitle() != null && advert.getText() != null) {
            String token = authHeader.substring(7);
            UUID id_sender = jwtService.getUserIdFromToken(token);
            User sender = userService.getById(id_sender);

            advert.setUser(sender);
            advert.setSendDate(new Date(System.currentTimeMillis()));
            advertService.addAdvert(advert);
            return;
        }
        response.sendError(HttpServletResponse.SC_CONFLICT, "Missing required fields!");
    }

    @DeleteMapping("/delete/{uuid}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public void deleteById(@PathVariable("uuid") UUID uuid, HttpServletResponse response) throws IOException {
        if(advertService.getById(uuid) != null) {
            advertService.deleteById(uuid);
            return;
        }
        response.sendError(HttpServletResponse.SC_NOT_FOUND, "Advert not found!");
    }

    @PatchMapping("/edit/{uuid}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public void editById(@PathVariable("uuid") UUID uuid, @RequestBody Advert advert, @RequestHeader("Authorization") String authHeader, HttpServletResponse response) throws IOException {
        if(advertService.getById(uuid) != null) {
            String token = authHeader.substring(7);
            UUID id_sender = jwtService.getUserIdFromToken(token);
            User sender = userService.getById(id_sender);

            advert.setUser(sender);
            advert.setSendDate(new Date(System.currentTimeMillis()));
            advertService.editById(uuid, advert);
            return;
        }
        response.sendError(HttpServletResponse.SC_NOT_FOUND, "Advert not found!");
    }
}