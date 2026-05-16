package com.gregluna.civiclens.dto;

import java.time.LocalDate;

public record ComplaintTrendResponse(
        LocalDate date,
        Long count
) {}
