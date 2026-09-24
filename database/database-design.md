# LIFE-LINK — Database Design & Schema Specifications

## 1. Overview
The LIFE-LINK relational database is implemented using MySQL 8.0+ and managed via Prisma ORM. The database enforces strict referential integrity, compound indexes for fast geolocation & status filtering, unique constraints for concurrency protection, and full audit logging.

---

## 2. Table Specifications & Indexes

### 2.1 Users (`users`)
Primary account store for all platform participants.
- `id` (VARCHAR(36), PK)
- `name` (VARCHAR(100))
- `email` (VARCHAR(150), UK)
- `phone` (VARCHAR(20), UK)
- `password_hash` (VARCHAR(255))
- `role` (ENUM: `DONOR`, `REQUESTER`, `HOSPITAL`, `BLOOD_BANK`, `ADMIN`)
- `status` (ENUM: `ACTIVE`, `SUSPENDED`, `INACTIVE`)
- `created_at`, `updated_at`
- **Indexes**: `(email)`, `(role)`, `(status)`

### 2.2 Donor Profiles (`donor_profiles`)
Contains donor availability and blood group metrics.
- `id` (VARCHAR(36), PK)
- `user_id` (VARCHAR(36), FK -> users.id, UK)
- `blood_group` (ENUM: `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`)
- `city`, `area`, `postal_code`
- `latitude`, `longitude` (DECIMAL(10,8), DECIMAL(11,8))
- `is_available` (BOOLEAN, default: true)
- `verification_status` (ENUM: `PENDING`, `VERIFIED`, `REJECTED`)
- `last_donation_date` (DATETIME, nullable)
- `notification_preference` (VARCHAR(50))
- **Indexes**: `(blood_group, is_available, city, verification_status)`

### 2.3 Hospitals (`hospitals`)
Hospital facility profiles linked to `users`.
- `id` (VARCHAR(36), PK)
- `user_id` (VARCHAR(36), FK -> users.id, UK)
- `hospital_name` (VARCHAR(200))
- `address`, `city`, `area`, `postal_code`
- `latitude`, `longitude`
- `verification_status` (ENUM: `PENDING`, `VERIFIED`, `REJECTED`)

### 2.4 Blood Banks (`blood_banks`)
Blood bank facilities linked to `users`.
- `id` (VARCHAR(36), PK)
- `user_id` (VARCHAR(36), FK -> users.id, UK)
- `bank_name` (VARCHAR(200))
- `address`, `city`, `area`, `postal_code`
- `latitude`, `longitude`
- `verification_status` (ENUM: `PENDING`, `VERIFIED`, `REJECTED`)

### 2.5 Blood Requests (`blood_requests`)
Emergency and regular blood request tickets.
- `id` (VARCHAR(36), PK)
- `requester_id` (VARCHAR(36), FK -> users.id)
- `hospital_id` (VARCHAR(36), FK -> hospitals.id, nullable)
- `blood_group` (ENUM)
- `units_required` (INT)
- `urgency` (ENUM: `NORMAL`, `URGENT`, `EMERGENCY`)
- `city`, `area`, `postal_code`, `latitude`, `longitude`
- `required_date_time` (DATETIME)
- `reason` (TEXT)
- `status` (ENUM: `OPEN`, `MATCHING`, `RESPONSES_RECEIVED`, `DONOR_CONFIRMED`, `PARTIALLY_FULFILLED`, `FULFILLED`, `CANCELLED`, `EXPIRED`)
- **Indexes**: `(blood_group, status, urgency, city, created_at)`

### 2.6 Donor Responses (`donor_responses`)
Tracks donor responses to blood requests.
- `id` (VARCHAR(36), PK)
- `blood_request_id` (VARCHAR(36), FK -> blood_requests.id)
- `donor_id` (VARCHAR(36), FK -> donor_profiles.id)
- `response_status` (ENUM: `ACCEPTED`, `DECLINED`, `MAYBE`)
- `responded_at` (DATETIME)
- `notes` (TEXT)
- **Unique Constraint**: `(blood_request_id, donor_id)` -> Prevents multiple responses from the same donor for a single request.

### 2.7 Blood Inventory (`blood_inventory`)
Inventory tracking for verified blood banks.
- `id` (VARCHAR(36), PK)
- `blood_bank_id` (VARCHAR(36), FK -> blood_banks.id)
- `blood_group` (ENUM)
- `units_available` (INT)
- `location` (VARCHAR(100))
- `last_updated` (DATETIME)
- `status` (ENUM: `AVAILABLE`, `LOW`, `OUT_OF_STOCK`, `EXPIRED`)
- **Indexes**: `(blood_bank_id, blood_group, status)`

### 2.8 Audit Logs (`audit_logs`)
System-wide immutable security & action audit trail.
- `id` (VARCHAR(36), PK)
- `user_id` (VARCHAR(36), FK -> users.id, nullable)
- `action` (VARCHAR(100))
- `entity_type` (VARCHAR(100))
- `entity_id` (VARCHAR(100))
- `description` (TEXT)
- `created_at` (DATETIME)
