-- AlterTable: Convert role from enum to string
-- First, update existing values to lowercase
UPDATE "user" SET "role" = 'user' WHERE "role" = 'USER';
UPDATE "user" SET "role" = 'admin' WHERE "role" = 'ADMIN';

-- Alter the column type from Role enum to TEXT
ALTER TABLE "user" 
  ALTER COLUMN "role" TYPE TEXT USING "role"::TEXT,
  ALTER COLUMN "role" SET DEFAULT 'user';

-- Drop the Role enum type
DROP TYPE IF EXISTS "Role";
