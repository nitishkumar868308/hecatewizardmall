/*
  Warnings:

  - You are about to drop the column `usageLimit` on the `PromoUser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[promoId,userId]` on the table `PromoUser` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."PromoUser" DROP COLUMN "usageLimit";

-- CreateIndex
CREATE UNIQUE INDEX "PromoUser_promoId_userId_key" ON "public"."PromoUser"("promoId", "userId");
