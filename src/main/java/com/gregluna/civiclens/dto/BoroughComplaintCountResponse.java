package com.gregluna.civiclens.dto;

public record BoroughComplaintCountResponse(
        String borough,
        Long count
) {}
