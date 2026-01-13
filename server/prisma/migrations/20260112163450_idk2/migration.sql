/*
  Warnings:

  - You are about to drop the column `dateOpened` on the `Chart` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chart" DROP CONSTRAINT "Chart_ownerId_fkey";

-- AlterTable
ALTER TABLE "Chart" DROP COLUMN "dateOpened";
