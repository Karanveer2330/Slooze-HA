-- Test Users Setup Script
-- Based on Problem Statement Requirements
--
-- IMPORTANT: This SQL script only UPDATES existing users.
-- If users don't exist, they won't be created because passwords need to be hashed with bcrypt.
--
-- TO INSERT TEST USERS: Use the Node.js script instead:
--   cd server/database
--   node insert_test_users.js
--
-- This will create all test users with properly hashed passwords.
-- All users will have password: "password123"
--
-- After running the Node.js script, you can use this SQL to verify:
-- SELECT user_id, user_name, user_email, user_role, country 
-- FROM logins 
-- WHERE user_role IN ('admin', 'manager', 'member')
-- ORDER BY user_role, country, user_name;

-- Nick Fury: Admin (Business Owner)
-- Admin has no country restriction - can see all restaurants
UPDATE logins 
SET user_role = 'admin', country = 'India' 
WHERE user_email = 'nick.fury@example.com'
   OR user_name ILIKE '%nick%fury%';

-- Captain Marvel: Manager-India
UPDATE logins 
SET user_role = 'manager', country = 'India' 
WHERE user_email = 'captain.marvel@example.com'
   OR user_name ILIKE '%captain%marvel%';

-- Captain America: Manager-America
UPDATE logins 
SET user_role = 'manager', country = 'America' 
WHERE user_email = 'captain.america@example.com'
   OR user_name ILIKE '%captain%america%';

-- Thanos: Team Member-India
UPDATE logins 
SET user_role = 'member', country = 'India' 
WHERE user_email = 'thanos@example.com'
   OR user_name ILIKE '%thanos%';

-- Thor: Team Member-India
UPDATE logins 
SET user_role = 'member', country = 'India' 
WHERE user_email = 'thor@example.com'
   OR user_name ILIKE '%thor%';

-- Travis: Team Member-America
UPDATE logins 
SET user_role = 'member', country = 'America' 
WHERE user_email = 'travis@example.com'
   OR user_name ILIKE '%travis%';

-- Verify the updates
SELECT 
    user_id,
    user_name,
    user_email,
    user_role,
    country
FROM logins
WHERE user_role IN ('admin', 'manager', 'member')
ORDER BY user_role, country, user_name;



--
-- IMPORTANT: This SQL script only UPDATES existing users.
-- If users don't exist, they won't be created because passwords need to be hashed with bcrypt.
--
-- TO INSERT TEST USERS: Use the Node.js script instead:
--   cd server/database
--   node insert_test_users.js
--
-- This will create all test users with properly hashed passwords.
-- All users will have password: "password123"
--
-- After running the Node.js script, you can use this SQL to verify:
-- SELECT user_id, user_name, user_email, user_role, country 
-- FROM logins 
-- WHERE user_role IN ('admin', 'manager', 'member')
-- ORDER BY user_role, country, user_name;

-- Nick Fury: Admin (Business Owner)
-- Admin has no country restriction - can see all restaurants
UPDATE logins 
SET user_role = 'admin', country = 'India' 
WHERE user_email = 'nick.fury@example.com'
   OR user_name ILIKE '%nick%fury%';

-- Captain Marvel: Manager-India
UPDATE logins 
SET user_role = 'manager', country = 'India' 
WHERE user_email = 'captain.marvel@example.com'
   OR user_name ILIKE '%captain%marvel%';

-- Captain America: Manager-America
UPDATE logins 
SET user_role = 'manager', country = 'America' 
WHERE user_email = 'captain.america@example.com'
   OR user_name ILIKE '%captain%america%';

-- Thanos: Team Member-India
UPDATE logins 
SET user_role = 'member', country = 'India' 
WHERE user_email = 'thanos@example.com'
   OR user_name ILIKE '%thanos%';

-- Thor: Team Member-India
UPDATE logins 
SET user_role = 'member', country = 'India' 
WHERE user_email = 'thor@example.com'
   OR user_name ILIKE '%thor%';

-- Travis: Team Member-America
UPDATE logins 
SET user_role = 'member', country = 'America' 
WHERE user_email = 'travis@example.com'
   OR user_name ILIKE '%travis%';

-- Verify the updates
SELECT 
    user_id,
    user_name,
    user_email,
    user_role,
    country
FROM logins
WHERE user_role IN ('admin', 'manager', 'member')
ORDER BY user_role, country, user_name;


