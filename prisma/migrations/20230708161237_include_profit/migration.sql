/*
  Warnings:

  - You are about to drop the column `excludeProfit` on the `InterLink` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InterLink" DROP COLUMN "excludeProfit",
ADD COLUMN     "includeProfit" BOOLEAN NOT NULL DEFAULT false;
