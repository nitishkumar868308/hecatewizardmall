/*
  Warnings:

  - You are about to drop the column `bio` on the `AstrologerAccount` table. All the data in the column will be lost.
  - You are about to drop the column `countryCode` on the `AstrologerAccount` table. All the data in the column will be lost.
  - You are about to drop the column `displayName` on the `AstrologerAccount` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `AstrologerAccount` table. All the data in the column will be lost.
  - You are about to drop the column `isApproved` on the `AstrologerAccount` table. All the data in the column will be lost.
  - You are about to drop the column `isRejected` on the `AstrologerAccount` table. All the data in the column will be lost.
  - You are about to drop the column `paidPenalty` on the `AstrologerAccount` table. All the data in the column will be lost.
  - You are about to drop the column `penalty` on the `AstrologerAccount` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `AstrologerAccount` table. All the data in the column will be lost.
  - You are about to drop the column `phoneLocal` on the `AstrologerAccount` table. All the data in the column will be lost.
  - You are about to drop the column `rejectReason` on the `AstrologerAccount` table. All the data in the column will be lost.
  - You are about to drop the column `revenueAdmin` on the `AstrologerAccount` table. All the data in the column will be lost.
  - You are about to drop the column `revenueAstrologer` on the `AstrologerAccount` table. All the data in the column will be lost.
  - You are about to drop the column `settlementAmount` on the `AstrologerAccount` table. All the data in the column will be lost.
  - You are about to drop the column `idProofType` on the `AstrologerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `idProofValue` on the `AstrologerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `AstrologerService` table. All the data in the column will be lost.
  - You are about to drop the column `currencySymbol` on the `AstrologerService` table. All the data in the column will be lost.
  - You are about to drop the `AstrologerTransaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Certificate` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `AstrologerAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phoneNumber` to the `AstrologerAccount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Certificate" DROP CONSTRAINT "Certificate_astrologerId_fkey";

-- DropIndex
DROP INDEX "public"."AstrologerAccount_phone_key";

-- AlterTable
ALTER TABLE "public"."AstrologerAccount" DROP COLUMN "bio",
DROP COLUMN "countryCode",
DROP COLUMN "displayName",
DROP COLUMN "isActive",
DROP COLUMN "isApproved",
DROP COLUMN "isRejected",
DROP COLUMN "paidPenalty",
DROP COLUMN "penalty",
DROP COLUMN "phone",
DROP COLUMN "phoneLocal",
DROP COLUMN "rejectReason",
DROP COLUMN "revenueAdmin",
DROP COLUMN "revenueAstrologer",
DROP COLUMN "settlementAmount",
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."AstrologerProfile" DROP COLUMN "idProofType",
DROP COLUMN "idProofValue";

-- AlterTable
ALTER TABLE "public"."AstrologerService" DROP COLUMN "currency",
DROP COLUMN "currencySymbol";

-- DropTable
DROP TABLE "public"."AstrologerTransaction";

-- DropTable
DROP TABLE "public"."Certificate";

-- DropEnum
DROP TYPE "public"."TransactionType";

-- CreateIndex
CREATE UNIQUE INDEX "AstrologerAccount_phoneNumber_key" ON "public"."AstrologerAccount"("phoneNumber");
