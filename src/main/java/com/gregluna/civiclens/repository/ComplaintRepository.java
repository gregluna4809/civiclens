package com.gregluna.civiclens.repository;

import com.gregluna.civiclens.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
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
            GROUP BY COALESCE(b.name, 'Unknown')
            ORDER BY COUNT(*) DESC, COALESCE(b.name, 'Unknown') ASC
            """, nativeQuery = true)
    List<BoroughComplaintCountProjection> countComplaintsByBorough();

    @Query(value = """
            SELECT ct.name AS "complaintType",
                   COUNT(*) AS "complaintCount"
            FROM complaints c
            JOIN complaint_types ct ON ct.id = c.complaint_type_id
            GROUP BY ct.name
            ORDER BY COUNT(*) DESC, ct.name ASC
            LIMIT :limit
            """, nativeQuery = true)
    List<ComplaintTypeCountProjection> findTopComplaintTypes(@Param("limit") int limit);

    @Query(value = """
            SELECT a.code AS "agencyCode",
                   a.name AS "agencyName",
                   COUNT(*) AS "complaintCount"
            FROM complaints c
            JOIN agencies a ON a.id = c.agency_id
            GROUP BY a.code, a.name
            ORDER BY COUNT(*) DESC, a.code ASC
            LIMIT :limit
            """, nativeQuery = true)
    List<AgencyComplaintCountProjection> findTopAgencies(@Param("limit") int limit);

    @Query(value = """
            SELECT CAST(c.created_at AS DATE) AS date,
                   COUNT(*) AS "complaintCount"
            FROM complaints c
            WHERE c.created_at IS NOT NULL
            GROUP BY CAST(c.created_at AS DATE)
            ORDER BY CAST(c.created_at AS DATE) ASC
            """, nativeQuery = true)
    List<ComplaintTrendProjection> countComplaintTrendsByCreatedDate();

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
        LocalDate getDate();

        Long getComplaintCount();
    }
}
