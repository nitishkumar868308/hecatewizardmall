/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `AstrologerAccount` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `AstrologerAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `countryCode` to the `AstrologerAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `AstrologerAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneLocal` to the `AstrologerAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `AstrologerService` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currencySymbol` to the `AstrologerService` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('PENALTY', 'PAYMENT');

-- DropIndex
DROP INDEX "public"."AstrologerAccount_phoneNumber_key";

-- AlterTable
ALTER TABLE "public"."AstrologerAccount" DROP COLUMN "phoneNumber",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "countryCode" TEXT NOT NULL,
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isRejected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paidPenalty" DOUBLE PRECISION,
ADD COLUMN     "penalty" DOUBLE PRECISION,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "phoneLocal" TEXT NOT NULL,
ADD COLUMN     "rejectReason" TEXT,
ADD COLUMN     "revenueAdmin" DOUBLE PRECISION,
ADD COLUMN     "revenueAstrologer" DOUBLE PRECISION,
ADD COLUMN     "settlementAmount" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."AstrologerProfile" ADD COLUMN     "idProofType" TEXT,
ADD COLUMN     "idProofValue" TEXT;

-- AlterTable
ALTER TABLE "public"."AstrologerService" ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "currencySymbol" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."AstrologerTransaction" (
    "id" SERIAL NOT NULL,
    "astrologerId" INTEGER NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "AstrologerTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Certificate" (
    "id" SERIAL NOT NULL,
    "astrologerId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AstrologerAccount_phone_key" ON "public"."AstrologerAccount"("phone");

-- AddForeignKey
ALTER TABLE "public"."Certificate" ADD CONSTRAINT "Certificate_astrologerId_fkey" FOREIGN KEY ("astrologerId") REFERENCES "public"."AstrologerAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
