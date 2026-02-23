-- CreateEnum
CREATE TYPE "public"."AdjustmentType" AS ENUM ('SHIPPING', 'NETWORK_FEE', 'ITEM_ADD', 'ITEM_REMOVE', 'DISCOUNT', 'PENALTY', 'TAX', 'MANUAL');

-- CreateEnum
CREATE TYPE "public"."AdjustmentImpact" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "public"."AdjustmentStatus" AS ENUM ('PENDING', 'PAID', 'APPLIED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."order_adjustments" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "adjustmentType" "public"."AdjustmentType" NOT NULL,
    "impact" "public"."AdjustmentImpact" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "reason" VARCHAR(255),
    "status" "public"."AdjustmentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentTxnId" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "order_adjustments_paymentTxnId_key" ON "public"."order_adjustments"("paymentTxnId");

-- AddForeignKey
ALTER TABLE "public"."order_adjustments" ADD CONSTRAINT "order_adjustments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
