-- CreateEnum
CREATE TYPE "ReviewType" AS ENUM ('SUPERVISOR', 'OPPONENT');

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "type" "ReviewType";
