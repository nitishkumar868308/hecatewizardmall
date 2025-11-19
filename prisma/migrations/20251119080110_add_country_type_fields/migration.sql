-- AlterTable
ALTER TABLE "public"."ShippingPricing" ADD COLUMN     "code" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "currency" TEXT,
ADD COLUMN     "currencySymbol" TEXT,
ADD COLUMN     "type" TEXT;
