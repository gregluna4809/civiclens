package com.gregluna.civiclens.service;

import com.gregluna.civiclens.dto.AgencyComplaintCountResponse;
import com.gregluna.civiclens.dto.BoroughComplaintCountResponse;
import com.gregluna.civiclens.dto.ComplaintTrendResponse;
import com.gregluna.civiclens.dto.ComplaintTypeCountResponse;
import com.gregluna.civiclens.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ComplaintRepository complaintRepository;

    @Transactional(readOnly = true)
    public List<BoroughComplaintCountResponse> getComplaintsByBorough(
            LocalDate startDate,
            LocalDate endDate,
            String borough,
            String agencyCode,
            String complaintType) {
        validateDateRange(startDate, endDate);
        return complaintRepository.countComplaintsByBorough(
                        startDate,
                        endDate,
                        normalizeFilter(borough),
                        normalizeFilter(agencyCode),
                        normalizeFilter(complaintType))
                .stream()
                .map(result -> new BoroughComplaintCountResponse(
                        result.getBorough(),
                        result.getComplaintCount()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ComplaintTypeCountResponse> getTopComplaintTypes(
            int limit,
            LocalDate startDate,
            LocalDate endDate,
            String borough,
            String agencyCode,
            String complaintType) {
        validateDateRange(startDate, endDate);
        return complaintRepository.findTopComplaintTypes(
                        limit,
                        startDate,
                        endDate,
                        normalizeFilter(borough),
                        normalizeFilter(agencyCode),
                        normalizeFilter(complaintType))
                .stream()
                .map(result -> new ComplaintTypeCountResponse(
                        result.getComplaintType(),
                        result.getComplaintCount()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AgencyComplaintCountResponse> getTopAgencies(
            int limit,
            LocalDate startDate,
            LocalDate endDate,
            String borough,
            String agencyCode,
            String complaintType) {
        validateDateRange(startDate, endDate);
        return complaintRepository.findTopAgencies(
                        limit,
                        startDate,
                        endDate,
                        normalizeFilter(borough),
                        normalizeFilter(agencyCode),
                        normalizeFilter(complaintType))
                .stream()
                .map(result -> new AgencyComplaintCountResponse(
                        result.getAgencyCode(),
                        result.getAgencyName(),
                        result.getComplaintCount()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ComplaintTrendResponse> getComplaintTrends(
            LocalDate startDate,
            LocalDate endDate,
            String borough,
            String agencyCode,
            String complaintType) {
        validateDateRange(startDate, endDate);
        return complaintRepository.countComplaintTrendsByCreatedDate(
                        startOfDay(startDate),
                        startOfNextDay(endDate),
                        normalizeFilter(borough),
                        normalizeFilter(agencyCode),
                        normalizeFilter(complaintType))
                .stream()
                .map(result -> new ComplaintTrendResponse(
                        result.getTrendDate().toLocalDate(),
                        result.getComplaintCount()))
                .toList();
    }

    private void validateDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
            throw new ResponseStatusException(BAD_REQUEST, "startDate must be on or before endDate");
        }
    }

    private String normalizeFilter(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private LocalDateTime startOfDay(LocalDate date) {
        return date == null ? null : date.atStartOfDay();
    }

    private LocalDateTime startOfNextDay(LocalDate date) {
        return date == null ? null : date.plusDays(1).atStartOfDay();
    }
}
