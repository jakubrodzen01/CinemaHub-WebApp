package com.example.ztpai.service;

import com.example.ztpai.entitie.Shift;
import com.example.ztpai.repository.ShiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ShiftService {
    public final ShiftRepository shiftRepository;


    public boolean existsById(UUID uuid) {
        return shiftRepository.existsById(uuid);
    }

    public void addShift(Shift shift) {
        shiftRepository.save(shift);
    }

    public List<Shift> getAll() {
        return shiftRepository.findAll();
    }

    public List<Shift> getByDate(Date date) {
        return shiftRepository.findByShiftDate(date);
    }
}
