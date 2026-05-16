package com.gregluna.civiclens.controller;

import com.gregluna.civiclens.dto.AgencyComplaintCountResponse;
import com.gregluna.civiclens.dto.BoroughComplaintCountResponse;
import com.gregluna.civiclens.dto.ComplaintTrendResponse;
import com.gregluna.civiclens.dto.ComplaintTypeCountResponse;
import com.gregluna.civiclens.service.AnalyticsService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

// Public analytics endpoints remain read-only by design.
@Validated
@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private static final int DEFAULT_LIMIT = 10;

    private final AnalyticsService analyticsService;

    @GetMapping("/complaints/by-borough")
    public List<BoroughComplaintCountResponse> getComplaintsByBorough(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String borough,
            @RequestParam(required = false) String agencyCode,
            @RequestParam(required = false) String complaintType) {
        return analyticsService.getComplaintsByBorough(startDate, endDate, borough, agencyCode, complaintType);
    }

    @GetMapping("/complaints/top-types")
    public List<ComplaintTypeCountResponse> getTopComplaintTypes(
            @RequestParam(defaultValue = "" + DEFAULT_LIMIT) @Min(1) @Max(100) int limit,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String borough,
            @RequestParam(required = false) String agencyCode,
            @RequestParam(required = false) String complaintType) {
        return analyticsService.getTopComplaintTypes(limit, startDate, endDate, borough, agencyCode, complaintType);
    }

    @GetMapping("/agencies/top")
    public List<AgencyComplaintCountResponse> getTopAgencies(
            @RequestParam(defaultValue = "" + DEFAULT_LIMIT) @Min(1) @Max(100) int limit,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String borough,
            @RequestParam(required = false) String agencyCode,
            @RequestParam(required = false) String complaintType) {
        return analyticsService.getTopAgencies(limit, startDate, endDate, borough, agencyCode, complaintType);
    }

    @GetMapping("/complaints/trends")
    public List<ComplaintTrendResponse> getComplaintTrends(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String borough,
            @RequestParam(required = false) String agencyCode,
            @RequestParam(required = false) String complaintType) {
        return analyticsService.getComplaintTrends(startDate, endDate, borough, agencyCode, complaintType);
    }
}
