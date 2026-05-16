package com.gregluna.civiclens.dto;

public record ComplaintTypeCountResponse(
        String complaintType,
        Long count
) {}
