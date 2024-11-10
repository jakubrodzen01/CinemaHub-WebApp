package com.example.ztpai.entitie;

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
@Table(name = "availabilities")
public class Availability {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name="UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @JdbcTypeCode(SqlTypes.CHAR)
    @Column(length = 36, columnDefinition = "varchar(36)", updatable = false, nullable = false)
    private UUID id_availability;

    @ManyToOne
    @JoinColumn(name = "idUser" , nullable = true)
    private User user;

    @Column(name = "availabilityStartDate", nullable = true)
    private Date availabilityStartDate;

    @Column(name = "friday", nullable = true)
    private String friday;

    @Column(name = "saturday", nullable = true)
    private String saturday;

    @Column(name = "sunday", nullable = true)
    private String sunday;

    @Column(name = "monday", nullable = true)
    private String monday;

    @Column(name = "tuesday", nullable = true)
    private String tuesday;

    @Column(name = "wednesday", nullable = true)
    private String wednesday;

    @Column(name = "thursday", nullable = true)
    private String thursday;
}
