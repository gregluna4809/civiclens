# GREG.md

## Project Owner
Gregory Luna

## Background
Project owner has:
- Master’s degree in Computer Science
- public sector experience
- strong interest in backend engineering
- analytics/data engineering interest
- cloud deployment learning goals

This project serves as both:
- a serious portfolio artifact
- a learning vehicle

## Coding Preferences

Deliver complete implementations.

Do not provide fragmented or partial architecture unless explicitly requested.

Prefer:
- readable code
- explicit naming
- maintainable enterprise conventions
- practical backend engineering patterns
- consistency across the codebase

Avoid:
- overengineered abstractions
- academic architecture experiments
- unnecessary framework complexity
- "clever" code that hurts readability

## Code Documentation Preferences

Code must include meaningful, concise comments.

Purpose of comments:
- explain intent
- explain architectural purpose
- explain business logic
- explain non-obvious implementation choices

Do NOT include useless comments.

Bad:
```java
// Get complaints
return complaints;
```

Bad:
```java
// Set value
entity.setName(name);
```

Good:
```java
// Track ingestion execution history for troubleshooting and monitoring.
```

Good:
```java
// Normalize complaint categories to prevent duplicate analytics buckets.
```

Comment style:
- short
- professional
- informative
- sparse but useful

This codebase should be readable as a learning artifact.

## AI Agent Expectations

AI agents must:
- read project governance documents before making changes
- respect existing architecture decisions
- preserve project consistency
- explain major design changes
- implement incrementally when possible

Do not:
- silently redesign the architecture
- randomly replace technologies
- introduce major dependencies without justification
- create duplicate patterns for the same problem

## Technology Preferences

Preferred:
- Java
- Spring Boot
- Maven
- PostgreSQL
- Flyway
- REST APIs
- Render
- Supabase

Allowed later:
- Spring Security
- JWT
- Redis
- Docker

Avoid unless explicitly requested:
- Kotlin
- Node.js rewrites
- MongoDB-first designs
- unnecessary cloud complexity
- AI/LLM integrations for this project

## Project Philosophy

This is a serious backend portfolio project.

Goal:
Demonstrate practical backend engineering competence.

Not:
- tutorial toy code
- gimmick architecture
- résumé keyword stuffing
- hype-driven AI wrappers

## Scope Discipline

MVP first.

Working software before enhancements.

Production-quality simplicity over speculative complexity.

Do not add optional features before the current phase is complete.

## Owner Learning Preference

Project owner wants to understand the code.

Implementations should be:
- readable
- educational
- professionally structured
- easy to reason about

Clarity matters more than cleverness.