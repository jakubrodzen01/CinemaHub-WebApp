package com.example.ztpai.service;

import com.example.ztpai.entitie.Availability;
import com.example.ztpai.repository.AvailabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AvailabilityService {
    public final AvailabilityRepository availabilityRepository;

    public void addAvailability(Availability availability) {
        availability.setAvailabilityStartDate(Date.valueOf(getNextFriday()));
        availabilityRepository.save(availability);
    }

    public boolean existsById(UUID uuid) {
        return availabilityRepository.existsById(uuid);
    }

    public List<Availability> getAll() {
        return availabilityRepository.findAll();
    }

    public Availability getById(UUID uuid) {
        return availabilityRepository.findById(uuid).orElse(null);
    }

    private LocalDate getNextFriday() {
        LocalDate today = LocalDate.now();
        return today.with(TemporalAdjusters.nextOrSame(DayOfWeek.FRIDAY));
    }
}
