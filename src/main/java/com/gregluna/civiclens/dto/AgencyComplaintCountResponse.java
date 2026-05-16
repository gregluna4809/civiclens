package com.gregluna.civiclens.dto;

public record AgencyComplaintCountResponse(
        String agencyCode,
        String agencyName,
        Long count
) {}
