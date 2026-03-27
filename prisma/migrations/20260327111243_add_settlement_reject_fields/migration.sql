-- AlterTable
ALTER TABLE "public"."AstrologerAccount" ADD COLUMN     "isRejected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rejectReason" TEXT,
ADD COLUMN     "settlementAmount" DOUBLE PRECISION;
