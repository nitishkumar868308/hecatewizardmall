/*
  Warnings:

  - You are about to drop the column `hecateQuickGoStock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `platform` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stateIds` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `hecateQuickGoStock` on the `ProductVariation` table. All the data in the column will be lost.
  - You are about to drop the column `stateIds` on the `ProductVariation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "hecateQuickGoStock",
DROP COLUMN "platform",
DROP COLUMN "stateIds";

-- AlterTable
ALTER TABLE "public"."ProductVariation" DROP COLUMN "hecateQuickGoStock",
DROP COLUMN "stateIds";
