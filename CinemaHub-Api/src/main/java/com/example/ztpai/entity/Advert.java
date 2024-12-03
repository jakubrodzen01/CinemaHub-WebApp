package com.example.ztpai.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.sql.Date;
import java.util.UUID;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "adverts")
public class Advert {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name="UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(length = 36, columnDefinition = "varchar(36)", updatable = false, nullable = false)
    private UUID idAdvert;

    @ManyToOne
    @JoinColumn(name = "idSender", nullable = true)
    private User user;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "sendDate", nullable = true)
    private Date sendDate;

    @Column(name = "text", nullable = false, columnDefinition = "TEXT")
    private String text;
}
