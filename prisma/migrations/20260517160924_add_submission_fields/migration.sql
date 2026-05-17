/*
  Warnings:

  - A unique constraint covering the columns `[submissionId,type]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Made the column `type` on table `Review` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `department` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `faculty` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_opponentId_fkey";

-- DropIndex
DROP INDEX "Review_submissionId_key";

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "type" SET NOT NULL;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "annotation" TEXT,
ADD COLUMN     "department" "Department" NOT NULL,
ADD COLUMN     "faculty" "Faculty" NOT NULL,
ADD COLUMN     "topic" TEXT NOT NULL,
ADD COLUMN     "type" "Type" NOT NULL,
ALTER COLUMN "opponentId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Review_submissionId_type_key" ON "Review"("submissionId", "type");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
