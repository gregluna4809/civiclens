package com.gregluna.civiclens.repository;

import com.gregluna.civiclens.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    // Used during ingestion to skip records already present in the database.
    boolean existsBySourceId(String sourceId);

    // Native aggregation keeps reporting queries close to the PostgreSQL schema.
    @Query(value = """
            SELECT COALESCE(b.name, 'Unknown') AS borough,
                   COUNT(*) AS "complaintCount"
            FROM complaints c
            LEFT JOIN boroughs b ON b.id = c.borough_id
            JOIN agencies a ON a.id = c.agency_id
            JOIN complaint_types ct ON ct.id = c.complaint_type_id
            WHERE (:startDate IS NULL OR (c.created_at IS NOT NULL AND CAST(c.created_at AS DATE) >= CAST(:startDate AS DATE)))
              AND (:endDate IS NULL OR (c.created_at IS NOT NULL AND CAST(c.created_at AS DATE) <= CAST(:endDate AS DATE)))
              AND (:borough IS NULL OR LOWER(COALESCE(b.name, 'Unknown')) = LOWER(:borough))
              AND (:agencyCode IS NULL OR LOWER(a.code) = LOWER(:agencyCode))
              AND (:complaintType IS NULL OR LOWER(ct.name) = LOWER(:complaintType))
            GROUP BY COALESCE(b.name, 'Unknown')
            ORDER BY COUNT(*) DESC, COALESCE(b.name, 'Unknown') ASC
            """, nativeQuery = true)
    List<BoroughComplaintCountProjection> countComplaintsByBorough(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("borough") String borough,
            @Param("agencyCode") String agencyCode,
            @Param("complaintType") String complaintType);

    @Query(value = """
            SELECT ct.name AS "complaintType",
                   COUNT(*) AS "complaintCount"
            FROM complaints c
            JOIN complaint_types ct ON ct.id = c.complaint_type_id
            JOIN agencies a ON a.id = c.agency_id
            LEFT JOIN boroughs b ON b.id = c.borough_id
            WHERE (:startDate IS NULL OR (c.created_at IS NOT NULL AND CAST(c.created_at AS DATE) >= CAST(:startDate AS DATE)))
              AND (:endDate IS NULL OR (c.created_at IS NOT NULL AND CAST(c.created_at AS DATE) <= CAST(:endDate AS DATE)))
              AND (:borough IS NULL OR LOWER(COALESCE(b.name, 'Unknown')) = LOWER(:borough))
              AND (:agencyCode IS NULL OR LOWER(a.code) = LOWER(:agencyCode))
              AND (:complaintType IS NULL OR LOWER(ct.name) = LOWER(:complaintType))
            GROUP BY ct.name
            ORDER BY COUNT(*) DESC, ct.name ASC
            LIMIT :limit
            """, nativeQuery = true)
    List<ComplaintTypeCountProjection> findTopComplaintTypes(
            @Param("limit") int limit,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("borough") String borough,
            @Param("agencyCode") String agencyCode,
            @Param("complaintType") String complaintType);

    @Query(value = """
            SELECT a.code AS "agencyCode",
                   a.name AS "agencyName",
                   COUNT(*) AS "complaintCount"
            FROM complaints c
            JOIN agencies a ON a.id = c.agency_id
            JOIN complaint_types ct ON ct.id = c.complaint_type_id
            LEFT JOIN boroughs b ON b.id = c.borough_id
            WHERE (:startDate IS NULL OR (c.created_at IS NOT NULL AND CAST(c.created_at AS DATE) >= CAST(:startDate AS DATE)))
              AND (:endDate IS NULL OR (c.created_at IS NOT NULL AND CAST(c.created_at AS DATE) <= CAST(:endDate AS DATE)))
              AND (:borough IS NULL OR LOWER(COALESCE(b.name, 'Unknown')) = LOWER(:borough))
              AND (:agencyCode IS NULL OR LOWER(a.code) = LOWER(:agencyCode))
              AND (:complaintType IS NULL OR LOWER(ct.name) = LOWER(:complaintType))
            GROUP BY a.code, a.name
            ORDER BY COUNT(*) DESC, a.code ASC
            LIMIT :limit
            """, nativeQuery = true)
    List<AgencyComplaintCountProjection> findTopAgencies(
            @Param("limit") int limit,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("borough") String borough,
            @Param("agencyCode") String agencyCode,
            @Param("complaintType") String complaintType);

    @Query(value = """
            SELECT CAST(c.created_at AS DATE) AS "trendDate",
                   COUNT(*) AS "complaintCount"
            FROM complaints c
            JOIN agencies a ON a.id = c.agency_id
            JOIN complaint_types ct ON ct.id = c.complaint_type_id
            LEFT JOIN boroughs b ON b.id = c.borough_id
            WHERE c.created_at IS NOT NULL
              AND (CAST(:startDateTime AS timestamp) IS NULL OR c.created_at >= CAST(:startDateTime AS timestamp))
              AND (CAST(:endDateExclusive AS timestamp) IS NULL OR c.created_at < CAST(:endDateExclusive AS timestamp))
              AND (:borough IS NULL OR LOWER(COALESCE(b.name, 'Unknown')) = LOWER(:borough))
              AND (:agencyCode IS NULL OR LOWER(a.code) = LOWER(:agencyCode))
              AND (:complaintType IS NULL OR LOWER(ct.name) = LOWER(:complaintType))
            GROUP BY CAST(c.created_at AS DATE)
            ORDER BY CAST(c.created_at AS DATE) ASC
            """, nativeQuery = true)
    List<ComplaintTrendProjection> countComplaintTrendsByCreatedDate(
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateExclusive") LocalDateTime endDateExclusive,
            @Param("borough") String borough,
            @Param("agencyCode") String agencyCode,
            @Param("complaintType") String complaintType);

    interface BoroughComplaintCountProjection {
        String getBorough();

        Long getComplaintCount();
    }

    interface ComplaintTypeCountProjection {
        String getComplaintType();

        Long getComplaintCount();
    }

    interface AgencyComplaintCountProjection {
        String getAgencyCode();

        String getAgencyName();

        Long getComplaintCount();
    }

    interface ComplaintTrendProjection {
        Date getTrendDate();

        Long getComplaintCount();
    }
}
