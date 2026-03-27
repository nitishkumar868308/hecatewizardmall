-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('PENALTY', 'PAYMENT');

-- AlterTable
ALTER TABLE "public"."AstrologerAccount" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paidPenalty" DOUBLE PRECISION,
ADD COLUMN     "penalty" DOUBLE PRECISION,
ADD COLUMN     "revenueCut" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."AstrologerProfile" ADD COLUMN     "idProofType" TEXT,
ADD COLUMN     "idProofValue" TEXT;

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
