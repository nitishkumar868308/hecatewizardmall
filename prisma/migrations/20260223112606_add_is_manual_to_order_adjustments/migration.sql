-- AlterEnum
ALTER TYPE "public"."AdjustmentType" ADD VALUE 'ITEM_SHIPPING';

-- AlterTable
ALTER TABLE "public"."order_adjustments" ADD COLUMN     "isManual" BOOLEAN NOT NULL DEFAULT false;
