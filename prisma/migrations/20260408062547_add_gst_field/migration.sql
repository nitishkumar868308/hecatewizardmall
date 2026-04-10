/*
  Warnings:

  - You are about to drop the column `paidPenalty` on the `AstrologerAccount` table. All the data in the column will be lost.
  - You are about to drop the column `penalty` on the `AstrologerAccount` table. All the data in the column will be lost.
  - You are about to drop the column `settlementAmount` on the `AstrologerAccount` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."AstrologerAccount" DROP COLUMN "paidPenalty",
DROP COLUMN "penalty",
DROP COLUMN "settlementAmount",
ADD COLUMN     "gst" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "public"."AstrologerPenalty" (
    "id" SERIAL NOT NULL,
    "astrologerId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "settlement" DOUBLE PRECISION,
    "paid" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AstrologerPenalty_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."AstrologerPenalty" ADD CONSTRAINT "AstrologerPenalty_astrologerId_fkey" FOREIGN KEY ("astrologerId") REFERENCES "public"."AstrologerAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
