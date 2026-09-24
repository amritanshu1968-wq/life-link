# LIFE-LINK — System Architecture & Technical Specifications

## 1. System Overview

LIFE-LINK is a real-world, high-reliability emergency blood response and coordination platform built to solve critical blood shortage and time-sensitive donation matching challenges. 

Unlike generic CRUD platforms, LIFE-LINK coordinates:
- Patient/Requester Blood Requests (Emergency, Urgent, Normal)
- Blood Group Compatibility Matching Algorithms
- Geolocation Radius Filtering (City, Area, Postal Code, Lat/Long Proximity)
- Concurrency-safe Donor Response Workflows
- Hospital & Blood Bank Inventory Tracking
- Role-based Access Control (RBAC) across 5 distinct roles: `DONOR`, `REQUESTER`, `HOSPITAL`, `BLOOD_BANK`, `ADMIN`
- Independent Verification via ASP.NET Core Web API
- Predictive AI Demand Forecasting & Suspicious Request Detection via Python FastAPI

---

## 2. High-Level System Architecture Diagram

```text
                            ┌─────────────────────────────────────────┐
                            │             CLIENT LAYER                │
                            └─────────────────────────────────────────┘
                                   │               │            │
                    ┌──────────────┘               │            └──────────────┐
                    ▼                              ▼                           ▼
          React Web Application           React Native App              Flutter App
       (Vite + TS + Tailwind CSS)           (TypeScript)                  (Dart)
                    │                              │                           │
                    └──────────────────────────────┼───────────────────────────┘
                                                   │
                                                   ▼
                                     ┌───────────────────────────┐
                                     │     Node.js Express API   │
                                     │       (TypeScript)        │
                                     └─────────────┬─────────────┘
                                                   │
                             ┌─────────────────────┼─────────────────────┐
                             ▼                     ▼                     ▼
                     ┌───────────────┐     ┌───────────────┐     ┌───────────────┐
                     │   Prisma ORM  │     │ ASP.NET Core  │     │ Python FastAPI│
                     │  Data Access  │     │ Verification  │     │  AI/ML Engine │
                     └───────┬───────┘     └───────────────┘     └───────────────┘
                             │
                             ▼
                     ┌───────────────┐
                     │  MySQL 8.0+   │
                     │  Relational DB│
                     └───────────────┘
```

---

## 3. Technology Map & Rationale

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Primary Backend** | Node.js, Express.js, TypeScript | High performance, type safety, modular architecture |
| **Primary Database** | MySQL 8.0+ | ACID compliance, robust foreign key constraints, transactional concurrency protection |
| **ORM** | Prisma | Strongly-typed SQL queries, schema migrations, seed pipeline |
| **Verification Service** | C#, ASP.NET Core, EF Core | Enterprise-grade isolated audit & regulatory verification pipeline for healthcare entities |
| **AI/ML Service** | Python 3.13, FastAPI, Pandas, Scikit-learn | Time-series forecasting for blood demand, isolation forest anomaly flags for suspicious requests |
| **Web Frontend** | React 18, Vite, TypeScript, Tailwind CSS | Clean developer-first UI, zero bloat, instant HMR, accessible emergency UX |
| **Mobile Clients** | React Native (Donor), Flutter (Requester) | Native performance on Android/iOS accessing unified REST endpoints |

---

## 4. End-to-End Emergency Business Flow

```text
1. Request Creation
   Patient / Hospital -> POST /api/blood-requests 
   (Group, Units, Urgency, Geolocation, Hospital ID)
   
2. State Transition: OPEN -> MATCHING
   BloodMatchingService checks:
   a. Medically verified ABO/Rh blood compatibility rules
   b. Active Donor Availability (is_available = true)
   c. Proximity radius (City/Area/Lat-Long)
   d. Donor account verification & cooldown limits

3. Notification Dispatch
   NotificationService notifies compatible nearby donors via In-App notifications.

4. Concurrency-Protected Donor Response
   Donor -> POST /api/blood-requests/:id/respond
   MySQL Transaction checks remaining unit balance to prevent over-allocation.
   State Transition -> RESPONSES_RECEIVED -> DONOR_CONFIRMED.

5. Fulfillment & Audit
   Hospital confirms donation -> POST /api/blood-requests/:id/fulfill
   Donation Record created -> State Transition -> FULFILLED.
   Audit Log generated -> Audit Trail updated.
```

---

## 5. Security & Compliance Rules

1. **Authentication & Authorization**: JWT token with embedded `userId` and `role`. Route-level RBAC middlewares (`requireAuth`, `requireRole`).
2. **Password Hashing**: Salted bcrypt hashing (10 rounds minimum). Plaintext credentials never stored or logged.
3. **Data Privacy**: Donor coordinates are never exposed raw to external consumers; only approximate distance is returned.
4. **Non-AI Medical Boundaries**: Blood compatibility rules and donor eligibility are strictly hardcoded via standard medical matrices. AI endpoints serve purely advisory analytical functions.
