-- Reference tables are created first; complaints depends on all three.

CREATE TABLE boroughs (
    id   SERIAL      PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE agencies (
    id   SERIAL       PRIMARY KEY,
    code VARCHAR(20)  NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL
);

-- Normalized complaint categories to prevent duplicate analytics buckets.
CREATE TABLE complaint_types (
    id   SERIAL       PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE
);

CREATE TABLE complaints (
    id                BIGSERIAL    PRIMARY KEY,
    source_id         VARCHAR(100) NOT NULL UNIQUE,
    borough_id        INTEGER      REFERENCES boroughs(id),
    agency_id         INTEGER      NOT NULL REFERENCES agencies(id),
    complaint_type_id INTEGER      NOT NULL REFERENCES complaint_types(id),
    descriptor        VARCHAR(500),
    status            VARCHAR(50)  NOT NULL,
    incident_zip      VARCHAR(10),
    latitude          DOUBLE PRECISION,
    longitude         DOUBLE PRECISION,
    created_at        TIMESTAMP,
    closed_at         TIMESTAMP,
    ingested_at       TIMESTAMP    NOT NULL
);

-- Analytics queries group and filter by these columns frequently.
CREATE INDEX idx_complaints_borough_id        ON complaints(borough_id);
CREATE INDEX idx_complaints_agency_id         ON complaints(agency_id);
CREATE INDEX idx_complaints_complaint_type_id ON complaints(complaint_type_id);
CREATE INDEX idx_complaints_status            ON complaints(status);
CREATE INDEX idx_complaints_created_at        ON complaints(created_at);

-- Track ingestion execution history for troubleshooting and monitoring.
CREATE TABLE ingestion_jobs (
    id                BIGSERIAL    PRIMARY KEY,
    job_type          VARCHAR(50)  NOT NULL,
    status            VARCHAR(50)  NOT NULL,
    started_at        TIMESTAMP    NOT NULL,
    finished_at       TIMESTAMP,
    records_processed INTEGER      NOT NULL DEFAULT 0,
    error_message     TEXT
);
