-- CreateTable
CREATE TABLE "public"."DonationCampaign" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amounts" DOUBLE PRECISION[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DonationCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserDonation" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "donatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "donationCampaignId" INTEGER NOT NULL,

    CONSTRAINT "UserDonation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."UserDonation" ADD CONSTRAINT "UserDonation_donationCampaignId_fkey" FOREIGN KEY ("donationCampaignId") REFERENCES "public"."DonationCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
