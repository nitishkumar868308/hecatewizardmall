-- AlterTable
ALTER TABLE "public"."Orders" ADD COLUMN     "donationAmount" DOUBLE PRECISION,
ADD COLUMN     "donationCampaignId" INTEGER,
ADD COLUMN     "note" TEXT,
ADD COLUMN     "promoCode" TEXT;
