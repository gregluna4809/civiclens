# CivicLens

A full-stack civic analytics platform that ingests live NYC 311 service request data, normalizes it into a relational PostgreSQL schema, and surfaces interactive analytics through a Spring Boot backend and React dashboard.

Built as a portfolio-quality engineering application emphasizing backend architecture, data ingestion pipelines, analytics APIs, full-stack integration, and real-world debugging.

---

## Live Demo

| Resource              | URL                                                              |
|-----------------------|------------------------------------------------------------------|
| Frontend Dashboard    | https://civiclens-z03r.onrender.com                              |
| Backend API (Swagger) | https://civiclens-api-cxbd.onrender.com/swagger-ui/index.html    |

> Hosted on Render's free tier — the backend may take 30–60 seconds to spin up on first request after idle.

---

## Screenshots

### Dashboard Overview

Interactive analytics dashboard showing complaint summaries, borough breakdowns, trend analysis, complaint category distribution, agency reporting patterns, and ingestion controls.

![CivicLens Dashboard Overview](docs/dashboard-overview.png)

### Data Ingestion Administration

Administrative demo tooling for controlled ingestion, ingestion job history, and dashboard reset functionality.

![CivicLens Data Ingestion Panel](docs/dashboard-ingestion.png)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Data Model](#data-model)
- [API Endpoints](#api-endpoints)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Engineering Challenges](#engineering-challenges)
- [Future Enhancements](#future-enhancements)
- [Author](#author)
- [License](#license)

---

## Overview

New York City publishes large volumes of public 311 complaint data through its Open Data platform. CivicLens transforms that raw feed into a structured analytics experience: live ingestion, a normalized relational schema, REST analytics APIs, and an interactive dashboard.

The goal was to build something closer to a production-style internal analytics platform than a typical CRUD tutorial project.

**Core capabilities:**

- Live NYC 311 data ingestion
- Normalized relational data storage
- Analytics aggregation APIs
- Interactive dashboard filtering
- Ingestion job tracking
- Demo environment reset tooling
- Production-style frontend/backend integration

---

## Features

### Live Data Ingestion

CivicLens connects directly to the NYC Open Data 311 API and ingests live complaint records into PostgreSQL.

- Configurable ingestion batch sizes
- Deduplication using source identifiers
- Ingestion job tracking and failure logging
- Dashboard-triggered ingestion controls
- Repeatable demo workflows

### Analytics API

Backend endpoints support optional filtering by date range, borough, agency, and complaint type. Available analytics:

- Complaint counts by borough
- Top complaint categories
- Top reporting agencies
- Complaint volume trends over time

### Interactive Frontend Dashboard

A React dashboard providing:

- Interactive filtering controls
- Responsive charts
- Loading skeletons and clean empty states
- User-friendly error handling
- Dashboard ingestion controls
- Administrative demo reset capability

### Demo Administration

Repeatable demo workflows are first-class. Administrative controls allow you to:

- Ingest fresh sample data
- Reset all demo data
- Clear ingestion history
- Rebuild analytics from scratch

---

## Architecture

CivicLens follows a backend-first layered architecture.

```text
┌────────────────────────────────────────┐
│   React + TypeScript + Vite Frontend   │
└──────────────────┬─────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────┐
│       REST API (Spring Boot)           │
└──────────────────┬─────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────┐
│            Service Layer               │
└──────────────────┬─────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────┐
│           Spring Data JPA              │
└──────────────────┬─────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────┐
│         PostgreSQL Database            │
└──────────────────┬─────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────┐
│      NYC Open Data 311 API             │
└────────────────────────────────────────┘
```

**Design goals:**

- Clean separation of concerns
- Production-style service layering
- Backend-owned business logic
- Normalized relational schema
- Frontend consuming real APIs only
- Simple, maintainable architecture

---

## Tech Stack

**Backend**
- Java 21
- Spring Boot 3 (Web, Data JPA, Actuator)
- Hibernate
- PostgreSQL
- Flyway
- Maven
- Springdoc OpenAPI / Swagger

**Frontend**
- React
- TypeScript
- Vite
- Recharts
- Axios
- CSS

**Deployment**
- Render Web Service (Spring Boot API)
- Render PostgreSQL
- Render Static Site (React frontend)

**External Data Source**
- NYC Open Data 311 Service Requests API

---

## Data Model

CivicLens uses a normalized relational design.

### Borough

Reference entity representing NYC boroughs (Brooklyn, Manhattan, Queens, Bronx, Staten Island).

### Agency

Normalized city agency records (NYPD, DOT, DSNY, DOHMH, etc.).

### ComplaintType

Normalized complaint categories (Noise - Residential, Illegal Parking, Street Condition, Rodent, etc.).

### Complaint

Primary fact table:

- NYC source identifier
- Created timestamp
- Closed timestamp
- Status
- Latitude / longitude
- Borough reference
- Agency reference
- Complaint type reference
- Ingestion timestamp

### IngestionJob

Tracks ingestion activity:

- Job type
- Status
- Started / finished timestamps
- Records processed
- Error details

---

## API Endpoints

### Health

```http
GET /api/health
```

### Analytics

```http
GET /api/analytics/complaints/trends
GET /api/analytics/complaints/top-types
GET /api/analytics/complaints/by-borough
GET /api/analytics/agencies/top
```

**Example filtered request:**

```http
GET /api/analytics/complaints/by-borough?startDate=2026-05-14&endDate=2026-05-14&borough=Brooklyn
```

### Admin / Demo Controls

```http
POST   /api/admin/ingest/311?limit=25     # Trigger ingestion
GET    /api/admin/ingest/jobs             # Ingestion job history
DELETE /api/admin/ingest/demo-data        # Reset demo environment
```

Full interactive documentation is available via Swagger UI: [https://civiclens-api-cxbd.onrender.com/swagger-ui/index.html](https://civiclens-api-cxbd.onrender.com/swagger-ui/index.html)

---

## Local Development

### Prerequisites

- Java 21
- PostgreSQL 16+
- Node.js 20+ and npm

The Maven wrapper (`./mvnw`) is included — no separate Maven install needed.

### Database Setup

Create the local database:

```sql
CREATE DATABASE civiclens;
```

Flyway migrations run automatically at backend startup.

### Run Backend

```bash
cd civiclens-api
./mvnw spring-boot:run
```

Backend runs on: `http://localhost:8080`
Swagger UI: `http://localhost:8080/swagger-ui/index.html`

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## Environment Variables

### Backend

| Variable                     | Description                                       |
|------------------------------|---------------------------------------------------|
| `SPRING_DATASOURCE_URL`      | JDBC URL for PostgreSQL                           |
| `SPRING_DATASOURCE_USERNAME` | Database username                                 |
| `SPRING_DATASOURCE_PASSWORD` | Database password                                 |
| `SERVER_PORT`                | Port the Spring Boot application listens on       |
| `CORS_ALLOWED_ORIGINS`       | Comma-separated list of allowed frontend origins  |

### Frontend

| Variable            | Description                          |
|---------------------|--------------------------------------|
| `VITE_API_BASE_URL` | Base URL of the deployed backend API |

---

## Deployment

CivicLens is deployed across three Render services:

- **Backend API** — Render Web Service running the Spring Boot application
- **Database** — Render managed PostgreSQL instance
- **Frontend** — Render Static Site serving the built Vite bundle

CORS, environment variables, and the frontend's `VITE_API_BASE_URL` are configured per-service through the Render dashboard.

---

## Engineering Challenges

Real debugging stories from building and deploying this project.

### PostgreSQL Native Query Parameter Typing

Analytics endpoints support optional filtering, which initially produced PostgreSQL errors like:

```text
could not determine data type of parameter
```

The root cause was PostgreSQL native query behavior with nullable optional parameters. Resolution involved:

- Explicit SQL parameter casting
- Refactoring nullable filter conditions
- Timestamp boundary corrections for date filtering

This was a genuine backend debugging problem rooted in PostgreSQL semantics — not a business logic defect.

### CORS Preflight Debugging

The dashboard demo reset feature initially failed when triggered from the frontend.

**Root cause:** Browser `DELETE` requests triggered a CORS preflight `OPTIONS` request, but the backend CORS configuration allowed only `GET` and `POST`.

**Resolution:** Added `DELETE` and `OPTIONS` support to the CORS configuration and restarted the backend.

A practical, instructive frontend/backend integration issue.

### External API Reliability

NYC Open Data occasionally returns transient failures during ingestion. CivicLens handles this by:

- Recording failed ingestion jobs
- Preserving failure history
- Allowing immediate retry from the dashboard

This reflects realistic external dependency behavior rather than assuming a perfect upstream.

---

## Future Enhancements

- Authentication and role-based admin access
- Better responsive layout for ultrawide displays
- Pagination and larger dataset ingestion
- Background job queue
- Redis caching for analytics queries
- Scheduled ingestion jobs with retry policies
- CSV export
- Interactive maps
- Complaint detail drill-down
- Docker Compose local orchestration
- AWS deployment
- CI/CD pipeline
- Monitoring and observability

---

## Why This Project

CivicLens demonstrates practical engineering skills across:

- Backend API development
- Relational data modeling
- Public API integration
- Data ingestion pipelines
- Analytics query design
- Frontend API integration
- Production-style debugging
- Full-stack deployment to a managed cloud platform

The emphasis is on engineering decisions and implementation realism rather than tutorial-style feature breadth.

---

## Author

**Gregory V. Luna**
[LinkedIn](https://linkedin.com/in/gregvluna) · [GitHub](https://github.com/gregluna4809)

---

## License

Portfolio / educational use.
