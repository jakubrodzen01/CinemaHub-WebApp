package com.example.ztpai.service;

import com.example.ztpai.entitie.Mail;
import com.example.ztpai.repository.MailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MailService {
    private final MailRepository mailRepository;

    public List<Mail> getMailsForRecipient(UUID recipientId) {
        return mailRepository.findByRecipient_IdUser(recipientId);
    }

    public List<Mail> getMailsForSender(UUID senderId) {
        return mailRepository.findBySender_IdUser(senderId);
    }

    public Mail getMailById(UUID mailId) {
        return mailRepository.findById(mailId).orElse(null);
    }

    public void addMail(Mail mail) {
        mailRepository.save(mail);
    }
}
