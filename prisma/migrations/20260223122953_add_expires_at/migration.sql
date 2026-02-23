-- AlterTable
ALTER TABLE "public"."order_adjustments" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ALTER COLUMN "manualType" SET DATA TYPE VARCHAR(200);
