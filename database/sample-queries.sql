-- LIFE-LINK Essential SQL Queries & Analytical Scripts

-- 1. Query Potentially Compatible Available Donors in Nearby City/Radius
SELECT 
    dp.id AS donor_profile_id,
    u.name AS donor_name,
    dp.blood_group,
    dp.city,
    dp.area,
    dp.is_available,
    dp.verification_status
FROM donor_profiles dp
JOIN users u ON dp.user_id = u.id
WHERE dp.is_available = TRUE
  AND dp.verification_status = 'VERIFIED'
  AND dp.city = 'Lucknow'
  AND dp.blood_group IN ('O-', 'O+'); -- Compatible for O+ request

-- 2. Count Active Emergency Requests by Blood Group
SELECT 
    blood_group,
    COUNT(*) AS emergency_request_count,
    SUM(units_required) AS total_units_needed
FROM blood_requests
WHERE status IN ('OPEN', 'MATCHING', 'RESPONSES_RECEIVED')
  AND urgency = 'EMERGENCY'
GROUP BY blood_group
ORDER BY emergency_request_count DESC;

-- 3. Check Real-Time Blood Bank Inventory Status
SELECT 
    bb.bank_name,
    bi.blood_group,
    bi.units_available,
    bi.status,
    bi.last_updated
FROM blood_inventory bi
JOIN blood_banks bb ON bi.blood_bank_id = bb.id
WHERE bi.units_available > 0
ORDER BY bb.bank_name, bi.blood_group;

-- 4. Audit Log Verification History for System Admins
SELECT 
    al.id,
    al.created_at,
    u.name AS performed_by,
    al.action,
    al.entity_type,
    al.description
FROM audit_logs al
LEFT JOIN users u ON al.user_id = u.id
ORDER BY al.created_at DESC
LIMIT 50;
