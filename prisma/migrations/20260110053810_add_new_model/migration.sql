/*
  Warnings:

  - You are about to drop the column `amount` on the `PromoCode` table. All the data in the column will be lost.
  - You are about to drop the column `assignedUsers` on the `PromoCode` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `PromoCode` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `PromoCode` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `PromoCode` table. All the data in the column will be lost.
  - Added the required column `appliesTo` to the `PromoCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountType` to the `PromoCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountValue` to the `PromoCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validFrom` to the `PromoCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validTill` to the `PromoCode` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."PromoDiscountType" AS ENUM ('FLAT', 'PERCENTAGE');

-- CreateEnum
CREATE TYPE "public"."PromoAppliesTo" AS ENUM ('ALL_USERS', 'SPECIFIC_USERS');

-- AlterTable
ALTER TABLE "public"."PromoCode" DROP COLUMN "amount",
DROP COLUMN "assignedUsers",
DROP COLUMN "endDate",
DROP COLUMN "startDate",
DROP COLUMN "type",
ADD COLUMN     "appliesTo" "public"."PromoAppliesTo" NOT NULL,
ADD COLUMN     "discountType" "public"."PromoDiscountType" NOT NULL,
ADD COLUMN     "discountValue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "usageLimit" INTEGER,
ADD COLUMN     "usedCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "validFrom" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "validTill" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "public"."PromoUser" (
    "id" SERIAL NOT NULL,
    "promoId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "usageLimit" INTEGER,

    CONSTRAINT "PromoUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."PromoUser" ADD CONSTRAINT "PromoUser_promoId_fkey" FOREIGN KEY ("promoId") REFERENCES "public"."PromoCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
