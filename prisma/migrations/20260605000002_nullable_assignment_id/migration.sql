-- Make Submission.assignmentId nullable with SET NULL on delete
-- so deleting an Assignment keeps the Submission as an archived record.

ALTER TABLE "Submission" ALTER COLUMN "assignmentId" DROP NOT NULL;

ALTER TABLE "Submission" DROP CONSTRAINT "Submission_assignmentId_fkey";

ALTER TABLE "Submission"
  ADD CONSTRAINT "Submission_assignmentId_fkey"
  FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
