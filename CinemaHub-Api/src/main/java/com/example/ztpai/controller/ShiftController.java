package com.example.ztpai.controller;

import com.example.ztpai.config.JwtService;
import com.example.ztpai.entity.Shift;
import com.example.ztpai.entity.User;
import com.example.ztpai.service.ShiftService;
import com.example.ztpai.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.sql.Date;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/shift")
public class ShiftController {
    public final ShiftService shiftService;
    public final JwtService jwtService;
    public final UserService userService;

    @PostMapping("/add")
    @PreAuthorize("hasAuthority('MANAGER') || hasAuthority('EMPLOYEE')")
    public void addShift(@RequestBody Shift shift, @RequestHeader("Authorization") String authHeader, HttpServletResponse response) throws IOException {
        if(shift.getShiftDate() != null && shift.getStartTime() != null && shift.getEndTime() != null && shift.getPlace() != null && shift.getUsername() != null) {
            User user = userService.getByUsername(shift.getUsername());
            shift.setUser(user);
            shiftService.addShift(shift);
            return;
        }
        response.sendError(HttpServletResponse.SC_CONFLICT, "Missing required fields!");
    }

    @GetMapping("/getByDate/{date}")
    @PreAuthorize("hasAuthority('MANAGER') || hasAuthority('EMPLOYEE')")
    public List<Shift> getByDate(@PathVariable String date, HttpServletResponse response) throws IOException {
        Date dateDate = Date.valueOf(date);
        List<Shift> shifts = shiftService.getByDate(dateDate);
        if(shifts.isEmpty()) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Shifts not found!");
            return null;
        }
        return shifts;
    }

    @GetMapping("/getAll")
    @PreAuthorize("hasAuthority('MANAGER')")
    public List<Shift> getAll() {
        return shiftService.getAll();
    }
}
