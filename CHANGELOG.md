# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com),
and this project adheres to Semantic Versioning.

## [Unreleased]

## [0.4.0] - 2026-06-09
### Added
- Multi-language support (English, Kiswahili, Español)
- Language selection screen at start of every session
- Help command (press 4) accessible from every screen
- Session drop tracking via ussd_drops table
- Error handling returning friendly END message on server crash
- UX audit from farmer's perspective

## [0.3.0] - 2026-06-07
### Added
- USSD menu via Africa's Talking sandbox
- Redis state machine with 4 states
- Phone validation
- Session timeout after 180 seconds
- Back option to reverse one state
- File logging to ussd.log
- USSD transcripts table for auditing
- created_via_session_id tracing
- Connected USSD to PostgreSQL CRM
- Source badges on dashboard
- Stats endpoint GET /api/stats/sources

### Fixed
- Duplicate phone numbers handled via upsert

## [0.2.0] - 2026-05-23
### Added
- PostgreSQL migration from SQLite
- JWT auth with bcrypt password hashing
- Row-scoped leads by assigned user
- Role-based access control

## [0.1.0] - 2026-05-16
### Added
- WhatsApp Cloud API webhook
- Four-state conversation bot
- SQLite lead management
- React dashboard