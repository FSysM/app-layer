/*
  Warnings:

  - The values [bachelor,master] on the enum `Type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'REJECTED';

-- AlterEnum
BEGIN;
CREATE TYPE "Type_new" AS ENUM ('bc', 'mgr', 'phd', 'other');
ALTER TABLE "Assignment" ALTER COLUMN "type" TYPE "Type_new" USING ("type"::text::"Type_new");
ALTER TYPE "Type" RENAME TO "Type_old";
ALTER TYPE "Type_new" RENAME TO "Type";
DROP TYPE "public"."Type_old";
COMMIT;
