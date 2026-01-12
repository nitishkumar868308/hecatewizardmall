/*
  Warnings:

  - A unique constraint covering the columns `[promoId,orderId]` on the table `PromoUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `PromoUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."PromoUser_promoId_userId_key";

-- AlterTable
ALTER TABLE "public"."PromoUser" ADD COLUMN     "orderId" INTEGER NOT NULL,
ALTER COLUMN "usedCount" SET DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "PromoUser_promoId_orderId_key" ON "public"."PromoUser"("promoId", "orderId");
