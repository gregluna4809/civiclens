package com.gregluna.civiclens.service;

import com.gregluna.civiclens.dto.AgencyComplaintCountResponse;
import com.gregluna.civiclens.dto.BoroughComplaintCountResponse;
import com.gregluna.civiclens.dto.ComplaintTrendResponse;
import com.gregluna.civiclens.dto.ComplaintTypeCountResponse;
import com.gregluna.civiclens.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ComplaintRepository complaintRepository;

    @Transactional(readOnly = true)
    public List<BoroughComplaintCountResponse> getComplaintsByBorough() {
        return complaintRepository.countComplaintsByBorough().stream()
                .map(result -> new BoroughComplaintCountResponse(
                        result.getBorough(),
                        result.getComplaintCount()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ComplaintTypeCountResponse> getTopComplaintTypes(int limit) {
        return complaintRepository.findTopComplaintTypes(limit).stream()
                .map(result -> new ComplaintTypeCountResponse(
                        result.getComplaintType(),
                        result.getComplaintCount()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AgencyComplaintCountResponse> getTopAgencies(int limit) {
        return complaintRepository.findTopAgencies(limit).stream()
                .map(result -> new AgencyComplaintCountResponse(
                        result.getAgencyCode(),
                        result.getAgencyName(),
                        result.getComplaintCount()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ComplaintTrendResponse> getComplaintTrends() {
        return complaintRepository.countComplaintTrendsByCreatedDate().stream()
                .map(result -> new ComplaintTrendResponse(
                        result.getDate(),
                        result.getComplaintCount()))
                .toList();
    }
}
