/*
  Warnings:

  - You are about to drop the column `isCustomizable` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `CustomProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomProductImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."CustomProduct" DROP CONSTRAINT "CustomProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CustomProductImage" DROP CONSTRAINT "CustomProductImage_customProductId_fkey";

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "isCustomizable";

-- DropTable
DROP TABLE "public"."CustomProduct";

-- DropTable
DROP TABLE "public"."CustomProductImage";
