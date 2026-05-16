package com.gregluna.civiclens.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "complaint_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Normalized complaint category name; unique to prevent duplicate analytics buckets.
    @Column(nullable = false, unique = true, length = 200)
    private String name;
}
