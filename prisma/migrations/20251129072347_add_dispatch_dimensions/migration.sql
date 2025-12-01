-- AlterTable
ALTER TABLE "public"."WarehouseDispatch" ADD COLUMN     "dimensions" JSONB,
ADD COLUMN     "shippingId" TEXT,
ADD COLUMN     "trackingId" TEXT,
ADD COLUMN     "trackingLink" TEXT;
