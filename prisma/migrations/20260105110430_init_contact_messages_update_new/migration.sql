/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `ContactMessage` table. All the data in the column will be lost.
  - You are about to drop the column `isRegistered` on the `ContactMessage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ContactMessage" DROP COLUMN "deletedAt",
DROP COLUMN "isRegistered",
ALTER COLUMN "readByUser" SET DEFAULT true;
