/*
  Warnings:

  - You are about to drop the column `serviceId` on the `ServiceDuration` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ServiceDuration" DROP CONSTRAINT "ServiceDuration_serviceId_fkey";

-- AlterTable
ALTER TABLE "public"."ServiceDuration" DROP COLUMN "serviceId";
