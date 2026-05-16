# AGENTS.md

## Project Overview
CivicLens API is a production-style backend portfolio project designed to demonstrate backend engineering, data engineering, API architecture, and cloud deployment skills.

Purpose:
Transform messy NYC public operational data into clean, queryable analytics APIs.

Primary dataset:
NYC 311 Service Requests

Target deployment:
- Render
- Supabase PostgreSQL

Primary technology stack:
- Java 21
- Spring Boot
- Maven
- PostgreSQL
- Flyway
- Spring Data JPA
- Spring Validation
- Lombok
- Spring Boot Actuator
- Springdoc OpenAPI

Future optional enhancements:
- JWT authentication
- Redis caching
- scheduled ingestion
- dashboard frontend
- geospatial analytics

## Agent Rules

### General Principles
Prioritize simplicity, clarity, and maintainability.

This project is intended to reflect professional backend engineering practices.

Avoid unnecessary complexity.

Prefer boring, well-understood solutions over clever abstractions.

### Architecture
Use standard layered architecture.

Expected structure:
- controller
- service
- repository
- entity/domain
- dto
- config
- exception
- mapper (if needed)

Do not introduce unless explicitly requested:
- microservices
- CQRS
- event sourcing
- hexagonal architecture
- domain-driven design complexity
- factory-heavy abstractions
- excessive interfaces

Keep architecture practical and readable.

### Code Style
Requirements:
- explicit naming
- constructor injection
- readable methods
- small focused classes
- RESTful conventions
- DTO usage for API responses
- validation annotations where appropriate

Avoid:
- giant god classes
- utility dumping grounds
- static abuse
- reflection tricks
- unnecessary generics complexity

### Code Documentation
Code should include concise, meaningful comments.

Comments should explain:
- intent
- non-obvious implementation decisions
- architectural purpose
- business logic where useful

Do NOT add trivial comments.

Bad:
```java
// Set the name
user.setName(name);
```

Good:
```java
// Normalize agency names to avoid duplicate reporting buckets.
```

Good:
```java
// Public analytics endpoints remain read-only by design.
```

Comment style:
- short
- professional
- useful
- not excessive

Assume the codebase should also function as a learning artifact.

### Database Rules
Use PostgreSQL appropriately.

Requirements:
- Flyway migrations
- explicit schema design
- proper constraints
- indexes where justified
- normalized schema initially

Do NOT:
- rely on Hibernate auto schema generation for production design
- expose database entities directly to API consumers

### API Design
REST conventions:

GET:
read-only analytics

POST:
admin actions / ingestion triggers

DELETE:
resource cleanup where needed

Responses:
- JSON only
- clean DTO contracts
- predictable naming

Avoid inconsistent endpoint design.

### Deployment Constraints
Target environment:
- Render
- Supabase

Assume:
- ephemeral application filesystem
- environment variables for secrets
- no local file persistence
- cloud-safe deployment patterns

Do not rely on:
- writing uploaded files permanently to local disk

### Scope Control
MVP only.

Allowed:
- health endpoint
- application bootstrap
- Flyway schema
- OpenAPI docs
- analytics endpoints
- ingestion pipeline

Not yet:
- authentication
- JWT
- Redis
- frontend
- AI/LLM integrations
- Docker unless explicitly requested

### Testing
Prefer practical test coverage.

Include where appropriate:
- controller tests
- service tests
- repository tests

Focus on meaningful coverage.

### Decision Rule
If uncertain:

choose the simpler implementation.