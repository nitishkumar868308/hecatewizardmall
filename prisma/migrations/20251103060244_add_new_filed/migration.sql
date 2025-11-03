-- AlterTable
ALTER TABLE "public"."Cart" ADD COLUMN     "bulkMinQty" INTEGER,
ADD COLUMN     "bulkPrice" DOUBLE PRECISION,
ADD COLUMN     "offerApplied" BOOLEAN DEFAULT false;
