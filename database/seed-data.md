# LIFE-LINK — Seed Data Documentation

This document describes the initial realistic dataset loaded by `prisma/seed.ts` for development and testing.

## Seeded Users

| Name | Role | Email | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **System Admin** | `ADMIN` | admin@lifelink.org | `ACTIVE` | Master administrator |
| **Rahul Sharma** | `DONOR` | rahul.sharma@gmail.com | `ACTIVE` | O+ donor, Lucknow |
| **Priya Verma** | `DONOR` | priya.verma@gmail.com | `ACTIVE` | A- donor, Lucknow |
| **Amit Patel** | `DONOR` | amit.patel@gmail.com | `ACTIVE` | B+ donor, Kanpur |
| **Ananya Roy** | `DONOR` | ananya.roy@gmail.com | `ACTIVE` | AB+ universal recipient donor |
| **Vikram Singh** | `REQUESTER` | vikram.singh@gmail.com | `ACTIVE` | Patient relative requester |
| **Dr. Sunita Mehta** | `HOSPITAL` | hospital.admin@apexhealth.org | `ACTIVE` | Apex Super Speciality Hospital |
| **City Blood Bank Admin** | `BLOOD_BANK` | inventory@citybloodbank.org | `ACTIVE` | Central Regional Blood Bank |

## Seeded Requests
- **REQ-1001**: O+ Emergency Blood Request (3 Units Required at Apex Hospital, Lucknow).
- **REQ-1002**: A- Urgent Request (2 Units Required at Trauma Centre, Lucknow).
- **REQ-1003**: B+ Normal Request (1 Unit Required for scheduled surgery).

## Seeded Inventories
- All 8 ABO/Rh blood groups (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`) configured across initial blood bank facilities with live unit balances and last-updated timestamps.
