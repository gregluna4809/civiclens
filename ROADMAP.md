# ROADMAP.md

# CivicLens API Roadmap

## Vision
Build a production-style backend analytics platform using NYC public data.

The project should demonstrate:
- backend engineering
- API design
- ETL/data ingestion
- SQL/data modeling
- cloud deployment
- production-oriented engineering practices

Final outcome:
A publicly deployed backend portfolio project.

## Phase 1 — Foundation

### Goal
Establish the backend project skeleton.

### Deliverables
- Spring Boot project setup
- Java 21
- Maven
- PostgreSQL connectivity
- Flyway configured
- application.yml
- health endpoint
- Actuator enabled
- OpenAPI / Swagger docs

### Success Criteria
Application starts locally.

Endpoints available:
- /api/health
- Swagger UI
- actuator health endpoint

## Phase 2 — Data Model

### Goal
Create stable database structure.

### Entities
Initial schema:
- complaints
- agencies
- boroughs
- complaint_types
- ingestion_jobs

### Deliverables
- Flyway migrations
- JPA entities
- repositories
- reference constraints
- indexes where justified

### Success Criteria
Database schema is stable and queryable.

## Phase 3 — Analytics API MVP

### Goal
Expose meaningful analytics endpoints.

### Endpoints
Examples:

GET /api/analytics/complaints/by-borough

GET /api/analytics/complaints/top-types

GET /api/analytics/complaints/trends

GET /api/analytics/agencies/top

### Success Criteria
Endpoints return useful JSON analytics responses.

## Phase 4 — Data Ingestion

### Goal
Load real NYC Open Data.

### Deliverables
- ingestion service
- external API client
- parsing
- normalization
- deduplication
- ingestion execution tracking

### Admin Endpoints
Examples:

POST /api/admin/ingest/311

GET /api/admin/ingest/jobs

### Success Criteria
System can ingest and persist real public data.

## Phase 5 — Deployment

### Goal
Deploy publicly.

### Deliverables
- Supabase PostgreSQL integration
- Render deployment
- production environment configuration
- secure environment variables
- deployment README

### Success Criteria
Public HTTPS API is live.

## Phase 6 — Hardening

### Goal
Improve reliability and professionalism.

### Deliverables
- exception handling
- request validation
- query optimization
- pagination
- indexing improvements
- actuator monitoring polish

### Success Criteria
Application behaves reliably in public demo use.

## Phase 7 — Authentication (Optional)

### Goal
Protect administrative functionality.

### Deliverables
- Spring Security
- JWT authentication
- admin role
- protected ingestion endpoints

### Success Criteria
Public analytics remain accessible while admin operations are secured.

## Phase 8 — Enhancements (Optional)

Potential additions:
- Redis caching
- geospatial analytics
- complaint hotspot detection
- service closure time analysis
- dashboard frontend

## Execution Rule
Complete phases sequentially.

Do not skip ahead unless explicitly approved.