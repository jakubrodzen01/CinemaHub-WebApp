package com.example.ztpai.model;

import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.util.UUID;

@Getter
@Setter
public class MailDto {
    private UUID idRecipient;
    private String title;
    private String text;
}
