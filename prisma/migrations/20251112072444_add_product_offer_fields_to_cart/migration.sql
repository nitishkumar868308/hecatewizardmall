/*
  Warnings:

  - The `productOfferId` column on the `Cart` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Cart" DROP COLUMN "productOfferId",
ADD COLUMN     "productOfferId" INTEGER;
