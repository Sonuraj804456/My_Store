-- Final migration: Remove role column from user table
-- This should only be done after data migration script has mapped users to merchants/customers

-- ALTER TABLE "user" DROP COLUMN IF EXISTS role;
-- ALTER TYPE user_role CASCADE;

-- Note: This migration is commented out because:
-- 1. It's a breaking change that removes user data
-- 2. A separate data migration script should run first to populate merchants table
-- 3. The application should be updated and tested before this final cleanup

-- To apply this migration safely:
-- 1. Run 0007 - 0011 migrations first
-- 2. Run the data migration script (migrate-to-merchants-customers.ts)
-- 3. Verify merchants and customers tables are populated
-- 4. Uncomment and run this migration
-- 5. Deploy application with new code
