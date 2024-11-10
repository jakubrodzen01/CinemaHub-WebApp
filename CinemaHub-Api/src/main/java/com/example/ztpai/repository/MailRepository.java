package com.example.ztpai.repository;

import com.example.ztpai.entitie.Mail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MailRepository extends JpaRepository<Mail, UUID> {
    List<Mail> findByRecipient_IdUser(UUID idRecipient);
    List<Mail> findBySender_IdUser(UUID idSender);
}
