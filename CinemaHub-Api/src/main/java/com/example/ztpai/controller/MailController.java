package com.example.ztpai.controller;

import com.example.ztpai.config.JwtService;
import com.example.ztpai.entitie.Mail;
import com.example.ztpai.entitie.User;
import com.example.ztpai.model.MailDto;
import com.example.ztpai.repository.MailRepository;
import com.example.ztpai.service.MailService;
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
@RequestMapping("/api/v1/mails")
public class MailController {
    private final MailRepository mailRepository;
    private final JwtService jwtService;
    private final MailService mailService;
    private final UserService userService;

    @GetMapping("/getAll")
    @PreAuthorize("hasAuthority('MANAGER') || hasAuthority('EMPLOYEE')")
    public List<Mail> getAllMailsForRecipient(@RequestHeader("Authorization") String authHeader, HttpServletResponse response) throws IOException {
        String token = authHeader.substring(7);
        UUID id_recepient = jwtService.getUserIdFromToken(token);

        return mailService.getMailsForRecipient(id_recepient);
    }

    @GetMapping("/getAllSent")
    @PreAuthorize("hasAuthority('MANAGER') || hasAuthority('EMPLOYEE')")
    public List<Mail> getAllSentMailsForRecipient(@RequestHeader("Authorization") String authHeader, HttpServletResponse response) throws IOException {
        String token = authHeader.substring(7);
        UUID id_sender = jwtService.getUserIdFromToken(token);

        return mailService.getMailsForSender(id_sender);
    }

    @GetMapping("/getById/{uuid}")
    @PreAuthorize("hasAuthority('MANAGER') || hasAuthority('EMPLOYEE')")
    public Mail getMailById(@PathVariable("uuid") UUID uuid, @RequestHeader("Authorization") String authHeader, HttpServletResponse response) throws IOException {
        String token = authHeader.substring(7);
        UUID id_recepient = jwtService.getUserIdFromToken(token);

        Mail mail = mailService.getMailById(uuid);

        if (!mail.getRecipient().getIdUser().equals(id_recepient)) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access denied: Mail does not belong to the user");
            return null;
        }
        return mail;
    }

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('MANAGER') || hasAuthority('EMPLOYEE')")
    public void addMail(@RequestBody MailDto mailDto, @RequestHeader("Authorization") String authHeader, HttpServletResponse response) throws IOException {
        if(mailDto.getTitle() != null && mailDto.getText() != null && mailDto.getIdRecipient() != null) {
            String token = authHeader.substring(7);
            UUID idSender = jwtService.getUserIdFromToken(token);
            User sender = userService.getById(idSender);
            User recipient = userService.getById(mailDto.getIdRecipient());

            Mail mail = Mail.builder()
                    .sender(sender)
                    .recipient(recipient)
                    .sendDate(new Date(System.currentTimeMillis()))
                    .title(mailDto.getTitle())
                    .text(mailDto.getText())
                    .build();

            mailService.addMail(mail);
            return;
        }
        response.sendError(HttpServletResponse.SC_CONFLICT, "Missing required fields!");
    }
}
