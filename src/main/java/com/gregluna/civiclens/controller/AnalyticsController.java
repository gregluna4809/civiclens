package com.gregluna.civiclens.controller;

import com.gregluna.civiclens.dto.AgencyComplaintCountResponse;
import com.gregluna.civiclens.dto.BoroughComplaintCountResponse;
import com.gregluna.civiclens.dto.ComplaintTrendResponse;
import com.gregluna.civiclens.dto.ComplaintTypeCountResponse;
import com.gregluna.civiclens.service.AnalyticsService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
    public List<BoroughComplaintCountResponse> getComplaintsByBorough() {
        return analyticsService.getComplaintsByBorough();
    }

    @GetMapping("/complaints/top-types")
    public List<ComplaintTypeCountResponse> getTopComplaintTypes(
            @RequestParam(defaultValue = "" + DEFAULT_LIMIT) @Min(1) @Max(100) int limit) {
        return analyticsService.getTopComplaintTypes(limit);
    }

    @GetMapping("/agencies/top")
    public List<AgencyComplaintCountResponse> getTopAgencies(
            @RequestParam(defaultValue = "" + DEFAULT_LIMIT) @Min(1) @Max(100) int limit) {
        return analyticsService.getTopAgencies(limit);
    }

    @GetMapping("/complaints/trends")
    public List<ComplaintTrendResponse> getComplaintTrends() {
        return analyticsService.getComplaintTrends();
    }
}
