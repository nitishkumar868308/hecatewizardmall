/*
  Warnings:

  - You are about to drop the column `revenueCut` on the `AstrologerAccount` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."AstrologerAccount" DROP COLUMN "revenueCut",
ADD COLUMN     "revenueAdmin" DOUBLE PRECISION,
ADD COLUMN     "revenueAstrologer" DOUBLE PRECISION;
