package com.gregluna.civiclens.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Unique key from NYC Open Data; prevents duplicate ingestion across runs.
    @Column(name = "source_id", nullable = false, unique = true, length = 100)
    private String sourceId;

    // Borough is nullable; NYC 311 records occasionally omit this field.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borough_id")
    private Borough borough;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agency_id", nullable = false)
    private Agency agency;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_type_id", nullable = false)
    private ComplaintType complaintType;

    @Column(length = 500)
    private String descriptor;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(name = "incident_zip", length = 10)
    private String incidentZip;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    // Timestamp reported by NYC Open Data; reflects when the 311 request was filed.
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    // Set at ingestion time; used to track when this record entered the system.
    @Column(name = "ingested_at", nullable = false, updatable = false)
    private LocalDateTime ingestedAt;
}
