-- AlterTable
ALTER TABLE "public"."Cart" ADD COLUMN     "productOfferApplied" BOOLEAN DEFAULT false,
ADD COLUMN     "productOfferDiscount" DOUBLE PRECISION;
