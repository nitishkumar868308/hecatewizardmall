-- CreateEnum
CREATE TYPE "public"."PenaltyStatus" AS ENUM ('PENDING', 'PARTIAL', 'PAID');

-- AlterTable
ALTER TABLE "public"."AstrologerPenalty" ADD COLUMN     "status" "public"."PenaltyStatus" NOT NULL DEFAULT 'PENDING';
