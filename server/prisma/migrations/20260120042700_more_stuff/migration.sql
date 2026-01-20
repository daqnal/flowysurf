/*
  Warnings:

  - Added the required column `data` to the `Chart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chart" ADD COLUMN     "data" JSONB NOT NULL;

-- AddForeignKey
ALTER TABLE "Chart" ADD CONSTRAINT "Chart_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
