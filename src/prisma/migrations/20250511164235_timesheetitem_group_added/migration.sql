/*
  Warnings:

  - Added the required column `groupId` to the `TimesheetItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TimesheetItem" ADD COLUMN     "groupId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "TimesheetItem_groupId_idx" ON "TimesheetItem"("groupId");

-- CreateIndex
CREATE INDEX "TimesheetItem_userId_idx" ON "TimesheetItem"("userId");

-- AddForeignKey
ALTER TABLE "TimesheetItem" ADD CONSTRAINT "TimesheetItem_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
