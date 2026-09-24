# LIFE-LINK — Entity Relationship Diagram (ERD)

## Visual Entity-Relationship Diagram

```mermaid
erDiagram
    USERS ||--o| DONOR_PROFILES : "has profile"
    USERS ||--o| PATIENT_PROFILES : "has profile"
    USERS ||--o| HOSPITALS : "manages hospital"
    USERS ||--o| BLOOD_BANKS : "manages bank"
    USERS ||--oN NOTIFICATIONS : "receives"
    USERS ||--oN VERIFICATIONS : "submits"
    USERS ||--oN AUDIT_LOGS : "triggers"
    USERS ||--oN EMERGENCY_CONTACTS : "maintains"

    HOSPITALS ||--oN BLOOD_REQUESTS : "hosts/requests"
    USERS ||--oN BLOOD_REQUESTS : "submits request"

    BLOOD_REQUESTS ||--oN DONOR_RESPONSES : "receives responses"
    DONOR_PROFILES ||--oN DONOR_RESPONSES : "responds to"

    DONOR_PROFILES ||--oN DONATION_RECORDS : "donates in"
    BLOOD_REQUESTS ||--o| DONATION_RECORDS : "fulfilled by"
    HOSPITALS ||--oN DONATION_RECORDS : "verifies"

    BLOOD_BANKS ||--oN BLOOD_INVENTORY : "maintains stock"

    BLOOD_REQUESTS ||--oN AI_ANALYSIS : "analyzed by"

    USERS {
        string id PK
        string name
        string email UK
        string phone UK
        string password_hash
        enum role "DONOR|REQUESTER|HOSPITAL|BLOOD_BANK|ADMIN"
        enum status "ACTIVE|SUSPENDED|INACTIVE"
        datetime created_at
        datetime updated_at
    }

    DONOR_PROFILES {
        string id PK
        string user_id FK,UK
        string blood_group "A+|A-|B+|B-|AB+|AB-|O+|O-"
        string city
        string area
        string postal_code
        float latitude
        float longitude
        boolean is_available
        enum verification_status "PENDING|VERIFIED|REJECTED"
        datetime last_donation_date
        string notification_preference
        datetime created_at
        datetime updated_at
    }

    HOSPITALS {
        string id PK
        string user_id FK,UK
        string hospital_name
        string address
        string city
        string area
        string postal_code
        float latitude
        float longitude
        enum verification_status "PENDING|VERIFIED|REJECTED"
        datetime created_at
        datetime updated_at
    }

    BLOOD_BANKS {
        string id PK
        string user_id FK,UK
        string bank_name
        string address
        string city
        string area
        string postal_code
        float latitude
        float longitude
        enum verification_status "PENDING|VERIFIED|REJECTED"
        datetime created_at
        datetime updated_at
    }

    BLOOD_REQUESTS {
        string id PK
        string requester_id FK
        string hospital_id FK
        string blood_group
        int units_required
        enum urgency "NORMAL|URGENT|EMERGENCY"
        string city
        string area
        string postal_code
        float latitude
        float longitude
        datetime required_date_time
        string reason
        enum status "OPEN|MATCHING|RESPONSES_RECEIVED|DONOR_CONFIRMED|PARTIALLY_FULFILLED|FULFILLED|CANCELLED|EXPIRED"
        datetime created_at
        datetime updated_at
    }

    DONOR_RESPONSES {
        string id PK
        string blood_request_id FK
        string donor_id FK
        enum response_status "ACCEPTED|DECLINED|MAYBE"
        datetime responded_at
        string notes
        datetime created_at
        datetime updated_at
    }

    DONATION_RECORDS {
        string id PK
        string donor_id FK
        string blood_request_id FK
        string hospital_id FK
        datetime donation_date
        int units
        enum verification_status "PENDING|VERIFIED|REJECTED"
        datetime created_at
    }

    BLOOD_INVENTORY {
        string id PK
        string blood_bank_id FK
        string blood_group
        int units_available
        string location
        datetime last_updated
        enum status "AVAILABLE|LOW|OUT_OF_STOCK|EXPIRED"
        datetime created_at
        datetime updated_at
    }

    NOTIFICATIONS {
        string id PK
        string user_id FK
        enum type "NEW_REQUEST|MATCHING_REQUEST|DONOR_ACCEPTED|..."
        string title
        string message
        boolean is_read
        datetime created_at
    }

    VERIFICATIONS {
        string id PK
        string user_id FK
        enum entity_type "HOSPITAL|BLOOD_BANK|DONOR"
        enum status "PENDING|VERIFIED|REJECTED|SUSPENDED"
        string document_path
        string reviewed_by
        datetime reviewed_at
        string remarks
        datetime created_at
        datetime updated_at
    }

    AUDIT_LOGS {
        string id PK
        string user_id FK
        string action
        string entity_type
        string entity_id
        string description
        datetime created_at
    }

    AI_ANALYSIS {
        string id PK
        string request_id FK
        enum analysis_type "DEMAND_FORECAST|SUSPICIOUS_ACTIVITY"
        json result
        float confidence
        string model_version
        datetime created_at
    }
```
