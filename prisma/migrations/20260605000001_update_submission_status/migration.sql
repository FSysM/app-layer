-- Recreate Status enum: remove PENDING/IN_PROGRESS, add APPROVED/REVIEWING
-- Existing rows are migrated: PENDING -> SUBMITTED, IN_PROGRESS -> APPROVED

ALTER TYPE "Status" RENAME TO "Status_old";

CREATE TYPE "Status" AS ENUM ('SUBMITTED', 'APPROVED', 'REVIEWING', 'COMPLETED', 'REJECTED');

ALTER TABLE "Submission" ALTER COLUMN "status" TYPE "Status" USING (
  CASE "status"::text
    WHEN 'PENDING'      THEN 'SUBMITTED'
    WHEN 'IN_PROGRESS'  THEN 'APPROVED'
    ELSE "status"::text
  END
)::"Status";

DROP TYPE "Status_old";
